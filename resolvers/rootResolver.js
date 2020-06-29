const userResolvers = require('./subResolvers/user.js');

module.exports = {
    Query: {
        ...userResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation
    }
}