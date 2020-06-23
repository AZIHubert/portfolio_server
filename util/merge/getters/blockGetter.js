const DataLoader = require('dataloader');
const Block = require('../../../models/Block');
const { userGetter } = require('./userGetter');
const { partGetter } = require('./partGetter');
const { contentsGetter } = require('./contentGetter');

const transformBlock = block => ({
    ...block._doc,
    _id: block._id,
    part: () => partGetter(block.part),
    contents: () => contentsGetter(block.content),
    createdBy: () => userGetter(block.createdBy),
    editedBy: () => userGetter(block.editedBy)
});

const blockLoader = new DataLoader(blockId => block(blockId));
const block = async blockId => {
    try {
        const block = await Block.findById(blockId);
        return transformBlock(block);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const blocksLoader = new DataLoader(blockIds => blocks(blockIds));
const blocks = async blockIds => {
    try {
        const blocks = await Promise.all(blockIds.map(blockId => Block.findById(blockId)));
        return blocks.map(block => transformBlock(block));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformBlock = transformBlock;
module.exports.blockGetter = async function(blockId){
    let block;
    if(blockId) block = await blockLoader.load(blockId);
    else block = null;
    return block;
};
module.exports.blocksLoader = async function(blockIds){
    let blocks;
    if(!!blockIds.length) blocks = await blocksLoader.loadMany(blockIds);
    else blocks = [];
    return blocks;
};