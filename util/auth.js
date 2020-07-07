const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const User = require('../models/User');

const createTokens = async (user, secret, secret2) => {
    const createToken = jwt.sign(
        {
            user: _.pick(user, ['_id', 'isAdmin', 'isActive'])
        },
        secret,
        {
            expiresIn: "1m"
        }
    );
    const createRefreshToken = jwt.sign(
        {
            user: _.pick(user, '_id')
        },
        secret2,
        {
            expiresIn: '7d'
        }
    );
    return [createToken, createRefreshToken];
}

const refreshTokens = async (refreshToken, SECRET, SECRET2) => {
    let userId = 0;
    let user = {};
    try {
        const { user: { _id } } = jwt.decode(refreshToken);
        userId = _id;
    } catch(err) { return {}; }
    if(!userId) return {};
    try {
        user = await User.findById(userId);
    } catch(err) { return {}; }
    if(!user) return {};
    const refreshSecret = user.password + SECRET2;
    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch(err) { return {}; }
    const [createToken, createRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
        token: createToken,
        refreshToken: createRefreshToken,
        user: {
            _id: user._id,
            isAdmin: user.isAdmin,
            isActive: user.isActive
        }
    };
};

const tryLogin = async (emailOrUsername, password, SECRET, SECRET2) => {
    try {
        const userUsername = await User.findOne({
            username: emailOrUsername
        });
        const userEmail = await User.findOne({
            email: emailOrUsername
        });
        const user = userUsername || userEmail;
        if(!user){
            return {
                OK: false,
                errors: [{ path: 'emailOrUsername', message: 'Wrong email or username'}]
            };
        }
        const valid = await bcrypt.compare(password, user.password);
        if(!valid){
            return {
                OK: false,
                errors: [{ path: 'password', message: 'Invalide password'}]
            };
        }
    
        const refreshTokenSecret = user.password + SECRET2;
    
        const [createToken, createRefreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
        return {
            OK: true,
            token: createToken,
            refreshToken: createRefreshToken,
            errors: []
        }
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.tryLogin = tryLogin;
module.exports.createTokens = createTokens;
module.exports.refreshTokens = refreshTokens;