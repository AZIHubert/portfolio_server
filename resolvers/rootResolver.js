const userResolver = require('./subResolvers/userResolver.js');
const workResolver = require('./subResolvers/workResolver');
const typeResolver = require('./subResolvers/typeResolver');
const imageResolver = require('./subResolvers/imageResolver');
const partResolver = require('./subResolvers/partResolver');
const blockResolver = require('./subResolvers/blockResolver');
const contentResolver = require('./subResolvers/contentResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...workResolver.Query,
        ...typeResolver.Query,
        ...imageResolver.Query,
        ...partResolver.Query,
        ...blockResolver.Query,
        ...contentResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...workResolver.Mutation,
        ...typeResolver.Mutation,
        ...imageResolver.Mutation,
        ...partResolver.Mutation,
        ...blockResolver.Mutation,
        ...contentResolver.Mutation
    }
}