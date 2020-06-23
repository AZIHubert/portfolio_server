const DataLoader = require('dataloader');
const Degree = require('../../../models/Degree');
const { userGetter } = require('./userGetter');

const transformDegree = degree => ({
    ...degree._doc,
    _id: degree._id,
    createdBy: () => userGetter(block.createdBy),
    editedBy: () => userGetter(block.editedBy)
});

const degreeLoader = new DataLoader(degreeId => degree(degreeId));
const degree = async degreeId => {
    try {
        const degree = await Degree.findById(blockId);
        return transformDegree(degree);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const degreesLoader = new DataLoader(degreeIds => degrees(degreeIds));
const degrees = async degreeIds => {
    try {
        const degrees = await Promise.all(degreeIds.map(degreeId => Degree.findById(degreeId)));
        return degrees.map(degree => transformDegree(degree));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformDegree = transformDegree;
module.exports.degreeGetter = async function(degreeId){
    let degree;
    if(degreeId) degree = await degreeLoader.load(degreeId);
    else degree = null;
    return degree;
};
module.exports.degreesLoader = async function(degreeIds){
    let degrees;
    if(!!degreeIds.length) degrees = await blocksLoader.loadMany(degreeIds);
    else degrees = [];
    return degrees;
};