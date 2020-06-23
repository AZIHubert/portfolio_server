const userResolvers = require('./subResolvers/user.js');

module.exports = {
    Query: {
        ...userResolvers.Query
    }
}