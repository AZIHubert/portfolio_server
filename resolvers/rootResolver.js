const userResolver = require('./subResolvers/userResolver.js');
const projectResolver = require('./subResolvers/projectResolver');
const typeResolver = require('./subResolvers/typeResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...projectResolver.Query,
        ...typeResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...projectResolver.Mutation,
        ...typeResolver.Mutation
    }
}