const userResolver = require('./subResolvers/userResolver.js');
const workResolver = require('./subResolvers/workResolver');
const typeResolver = require('./subResolvers/typeResolver');
const imageResolver = require('./subResolvers/imageResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...workResolver.Query,
        ...typeResolver.Query,
        ...imageResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...workResolver.Mutation,
        ...typeResolver.Mutation,
        ...imageResolver.Mutation
    }
}