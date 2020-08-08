const User = require('../../models/User');
const Image = require('../../models/Image');
const { tryLogin } = require('../../util/auth');
const { unrequiresAuth, requiresAuth, requiresAdmin } = require('../../util/permissions');
const { transformUser } = require('../../util/merge');
const bcrypt = require('bcryptjs');
const { createTokens } = require('../../util/auth');
const { SECRET, SECRET2, ADMINREGISTRATION } = require('../../config');

module.exports = {
    Query: {
        getUsers: requiresAdmin.createResolver(async (_, { sort, filter, skip, limit }) => {
            try {
                let users = await User.find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
                return users.map(user => transformUser(user));
            } catch (err) {
                throw new Error(err);
            }
        }),
        getUser: requiresAuth.createResolver(async (_, { userId }, { user: { _id } }) => {
            try {
                if(_id.toString() !== userId) throw new Error('You only can fetch info of your account');
                let user = await User.findById(userId);
                return transformUser(user);
            } catch (err) {
                throw new Error(err);
            }
        })
    },
    Mutation: {
        createUser: unrequiresAuth.createResolver(async (_, { ...params }) => {
            const errors = [];
            try {
                const newUser = new User({...params});
                const savedUser = await newUser.save();
                return {
                    OK: true,
                    errors,
                    user: transformUser(savedUser)
                };
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        loginUser: unrequiresAuth.createResolver(async (_, { emailOrUsername, password }, { SECRET, SECRET2 }) => {
            return tryLogin(emailOrUsername, password, SECRET, SECRET2);
        }),
        updateUser: requiresAuth.createResolver(async (_, { userId, ...params }, { user: { _id } }) => {
            const errors = [];
            if(_id.toString() !== userId) return {
                OK: false,
                errors: [{
                    path: 'general',
                    message: 'You only can modify your own account.'
                }]
            };
            try{
                let {
                    username: oldUsername,
                    firstname: oldFirstname,
                    lastname: oldLastname,
                    profilePicture: oldProfilePicture
                } = await User.findById(userId);
                oldProfilePicture = oldProfilePicture ? oldProfilePicture.toString() : null;

                if(oldProfilePicture === params.profilePicture)
                    delete params.profilePicture;
                if(params.username === undefined || oldUsername === params.username)
                    delete params.username;
                if(params.firstname === undefined || oldFirstname === params.firstname)
                    delete params.firstname;
                if(params.lastname === undefined || oldLastname === params.lastname)
                    delete params.lastname;

                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Profile has not change.'
                    }]
                };
                const existedUsername = await User.findOne({ username: params.username });
                if(existedUsername) return {
                    OK: false,
                    errors: [{
                        path: 'username',
                        message: 'Username already taken.'
                    }]
                };
                const updatedUser = await User.findByIdAndUpdate(userId, params, { new: true, runValidators: true, context: 'query' });
                if("profilePicture" in params){
                    await Image.findOneAndUpdate(
                        { _id: oldProfilePicture },
                        { $pull: { users: userId } }
                    );
                    await Image.findOneAndUpdate(
                        { _id: params.profilePicture },
                        { $push: { users: userId } }
                    );
                }
                return {
                    OK: true,
                    errors,
                    user: transformUser(updatedUser)
                };
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateUserEmail: requiresAuth.createResolver(async (_, { userId, email }, { user: { _id } }) => {
            const errors = [];
            if(_id.toString() !== userId) return {
                OK: false,
                errors: [{
                    path: 'general',
                    message: 'You only can modify your own account.'
                }]
            };
            try{
                const updatedUser = await User.findByIdAndUpdate(userId, { email }, { new: true, runValidators: true, context: 'query' });
                return {
                    OK: true,
                    errors,
                    user: transformUser(updatedUser)
                };
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateUserPassword: requiresAuth.createResolver(async (_, { userId, oldPassword, password }, { user: { _id } }) => {
            const errors = [];
            if(_id.toString() !== userId) return {
                OK: false,
                errors: [{
                    path: 'general',
                    message: 'You only can modify your own account.'
                }]
            };
            try{
                const user = await User.findById(userId);
                const valid = await bcrypt.compare(oldPassword, user.password);
                if(!valid) return {
                    OK: false,
                    errors: [{
                        path: 'oldPassword',
                        message: 'Wrong password'
                    }]
                };
                const samePassword = await bcrypt.compare(password, user.password);
                if(samePassword) return {
                    OK: false,
                    errors: [{
                        path: 'password',
                        message: 'Password has not changed.'
                    }]
                };
                const hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(password, 12, (err, hash) => {
                        if (err) reject(err)
                        resolve(hash)
                    });
                });
                const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
                const refreshTokenSecret = updatedUser.password + SECRET2;
                const [createToken, createRefreshToken] = await createTokens(updatedUser, SECRET, refreshTokenSecret);
                return {
                    OK: true,
                    errors,
                    token: createToken,
                    refreshToken: createRefreshToken
                };
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateUserAdmin: requiresAuth.createResolver(async (_, { userId, adminRegistrationPassword }, { user: { _id } }) => {
            const errors = [];
            if(_id.toString() !== userId) return {
                OK: false,
                errors: [{
                    path: 'general',
                    message: 'You only can modify your own account.'
                }]
            };
            try{
                if(adminRegistrationPassword.trim() === '') return {
                    OK: false,
                    errors: [{
                        path: 'adminRegistrationPassword',
                        message: 'Can\'t be empty.'
                    }]
                };
                if(adminRegistrationPassword !== ADMINREGISTRATION) return {
                    OK: false,
                    errors: [{
                        path: 'adminRegistrationPassword',
                        message: 'Wrong password'
                    }]
                };
                const updatedUser = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
                const refreshTokenSecret = updatedUser.password + SECRET2;
                const [createToken, createRefreshToken] = await createTokens(updatedUser, SECRET, refreshTokenSecret);
                return {
                    OK: true,
                    errors,
                    token: createToken,
                    refreshToken: createRefreshToken
                };
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        deleteUser: requiresAuth.createResolver(async (_, { userId, password }, { user: { _id } }) => {
            const errors = [];
            if(_id.toString() !== userId) return {
                OK: false,
                errors: [{
                    path: 'general',
                    message: 'You only able to delete your own account.'
                }]
            };
            try{
                const user = await User.findById(userId);
                const valid = await bcrypt.compare(password, user.password);
                if(!valid) return {
                    OK: false,
                    errors: [{
                        path: 'password',
                        message: 'Wrong password'
                    }]
                };
                const { profilePicture } = await User.deleteOne({ _id: userId });
                if(!!profilePicture) await Image.updateMany(
                    { _id: { $in: profilePicture } },
                    { $pull: { users: { $in: userId } } }
                );
                return { OK: true, errors }
            } catch (err) {
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: true,
                        errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        })
    }
}