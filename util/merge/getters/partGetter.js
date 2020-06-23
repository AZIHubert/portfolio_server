const DataLoader = require('dataloader');
const Part = require('../../../models/Part');
const { userGetter } = require('./userGetter');
const { projectGetter } = require('./projectGetter');
const { blocksGetter } = require('./blockGetter');

const transformPart = part => ({
    ...part._doc,
    _id: part._id,
    project: () => projectGetter(part.project),
    blocks: () => blocksGetter(part.blocks),
    createdBy: () => userGetter(part.createdBy),
    editedBy: () => userGetter(part.editedBy)
});

const partLoader = new DataLoader(partId => part(partId));
const part = async partId => {
    try {
        const part = await Part.findById(partId);
        return transformPart(part);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const partsLoader = new DataLoader(partIds => parts(partIds));
const parts = async partIds => {
    try {
        const parts = await Promise.all(partIds.map(partId => Part.findById(partId)));
        return parts.map(part => transformPart(part));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformPart = transformPart;
module.exports.partGetter = async function(partId){
    let part;
    if(partId) part = await partLoader.load(partId);
    else part = null;
    return part;
};
module.exports.partsGetter = async function(partIds){
    let parts;
    if(!!partIds.length) parts = await partsLoader.loadMany(partIds);
    else parts = [];
    return parts;
};