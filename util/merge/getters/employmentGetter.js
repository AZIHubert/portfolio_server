const DataLoader = require('dataloader');
const Employment = require('../../../models/Employment');
const { userGetter } = require('./userGetter');

const transformEmployment = employment => ({
    ...employment._doc,
    _id: employment._id,
    createdBy: () => userGetter(employment.createdBy),
    editedBy: () => userGetter(employment.editedBy)
});

const employmentLoader = new DataLoader(employmentId => employment(employmentId));
const employment = async employmentId => {
    try {
        const employment = await Employment.findById(employmentId);
        return transformEmployment(employment);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const employmentsLoader = new DataLoader(employmentIds => degrees(employmentIds));
const employments = async employmentIds => {
    try {
        const employments = await Promise.all(employmentIds.map(employmentId => Employment.findById(employmentId)));
        return employments.map(employment => transformEmployment(employment));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformEmployment = transformEmployment;
module.exports.employmentGetter = async function(employmentId){
    let employment;
    if(employmentId) employment = await employmentLoader.load(employmentId);
    else employment = null;
    return employment;
};
module.exports.employmentsGetter = async function(employmentIds){
    let employments;
    if(!!employmentIds.length) employments = await employmentsLoader.loadMany(employmentIds);
    else employments = [];
    return employments;
};