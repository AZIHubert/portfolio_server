const userResolver = require('./subResolvers/userResolver.js');
const projectResolver = require('./subResolvers/projectResolver');
const typeResolver = require('./subResolvers/typeResolver');
const imageResolver = require('./subResolvers/imageResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...projectResolver.Query,
        ...typeResolver.Query,
        ...imageResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...projectResolver.Mutation,
        ...typeResolver.Mutation,
        ...imageResolver.Mutation
    }
}