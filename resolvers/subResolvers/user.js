const User = require('../../models/User.js');

module.exports = {
    Query: {
        async getUsers() {
            try {
                try {
                    let users = await User.find();
                    return users;
                } catch(err) {
                    throw new Error(err);
                }
            } catch (err) {
                console.log(err);
            }
        },
        async getUser(_, { userId }){
            try {
                let user = await User.findById(userId);
                return user;
            } catch(err) {
                throw new Error(err);
            }
        }
    }
}