const User = require('../../models/User');
const { tryLogin } = require('../../util/auth');
const { transformUser } = require('../../util/merge');

module.exports = {
    Query: {
        async getUsers() {
            try {
                let users = await User.find();
                return users.map(user => transformUser(user));
            } catch (err) {
                console.log(err);
            }
        },
        async getUser(_, { userId }){
            try {
                let user = await User.findById(userId);
                return transformUser(user);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createUser: async (_, { ...params }, context) => {
            const errors = [];
            try {
                const newUser = new User({...params});
                const savedUser = await newUser.save();
                return {
                    OK: true,
                    errors,
                    user: transformUser(savedUser)
                };
            } catch(err) {
                // console.log(err);
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
        },
        loginUser: async  (_, { emailOrUsername, password }, { SECRET, SECRET2 }) => tryLogin(emailOrUsername, password, SECRET, SECRET2)
        // async editeUser() {

        // },
        // async deleteUser() {

        // }
    }
}