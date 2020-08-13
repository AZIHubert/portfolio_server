const userResolver = require('./subResolvers/userResolver.js');
const workResolver = require('./subResolvers/workResolver');
const typeResolver = require('./subResolvers/typeResolver');
const imageResolver = require('./subResolvers/imageResolver');
const partResolver = require('./subResolvers/partResolver');
const blockResolver = require('./subResolvers/blockResolver');
const contentResolver = require('./subResolvers/contentResolver');
const degreeResolver = require('./subResolvers/degreeResolver');
const traineeshipResolver = require('./subResolvers/traineeshipResolver');
const workshopResolver = require('./subResolvers/workshopResolver');
const employmentResolver = require('./subResolvers/employmentResolver');
const generalResolver = require('./subResolvers/generalResolver');
const emailResolver = require('./subResolvers/emailResolver');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...workResolver.Query,
        ...typeResolver.Query,
        ...imageResolver.Query,
        ...partResolver.Query,
        ...blockResolver.Query,
        ...contentResolver.Query,
        ...degreeResolver.Query,
        ...traineeshipResolver.Query,
        ...workshopResolver.Query,
        ...employmentResolver.Query,
        ...generalResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...workResolver.Mutation,
        ...typeResolver.Mutation,
        ...imageResolver.Mutation,
        ...partResolver.Mutation,
        ...blockResolver.Mutation,
        ...contentResolver.Mutation,
        ...degreeResolver.Mutation,
        ...traineeshipResolver.Mutation,
        ...workshopResolver.Mutation,
        ...employmentResolver.Mutation,
        ...generalResolver.Mutation,
        ...emailResolver.Mutation
    }
};