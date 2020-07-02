const userResolver = require('./subResolvers/userResolver.js');
const projectResolver = require('./subResolvers/projectResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...projectResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...projectResolver.Mutation
    }
}