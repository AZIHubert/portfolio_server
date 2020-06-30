const jwt = require('jsonwebtoken');
const { refreshTokens } = require('./auth');

const { SECRET, SECRET2 } = require('../config');

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if(token){
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
        } catch(err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newToken = await refreshTokens(token, refreshToken, SECRET, SECRET2);
            if(newToken.token && newToken.refreshToken){
                res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
                res.set('x-token', newToken.token);
                res.set('x-refresh-token', newToken.refreshToken);
            }
            req.user = newToken.user;
        }
    }
    next();
};

module.exports.addUser = addUser;