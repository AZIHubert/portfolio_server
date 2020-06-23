const User = require('../../../models/User');
const DataLoader = require('dataloader');
const { imageGetter } = require('./imageGetter');

const transformUser = user => ({
    ...user._doc,
    id: user._id,
    profilePicture: () => imageGetter(image.profilePicture)
});

const userLoader = new DataLoader(userId => user(userId));
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return transformUser(user);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const usersLoader = new DataLoader(userIds => users(userIds));
const users = async userIds => {
    try {
        const users = await Promise.all(userIds.map(userId => User.findById(userId)));
        return users.map(user => transformUser(user));
    } catch(err) {
        throw new Error(err);
    }
};

module.exports.transformUser = transformUser;
module.exports.userGetter = async function(userId){
    let user;
    if(userId) user = await userLoader.load(userId);
    else user = null;
    return user;
};
module.exports.usersGetter = async function(userIds){
    let users;
    if(!!userIds.length) users = await usersLoader.load(userIds);
    else users = [];
    return users;
};