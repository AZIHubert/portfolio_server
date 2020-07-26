const Block = require('../../models/Block');
const Part = require('../../models/Part');
const Content = require('../../models/Content');
const Image = require('../../models/Image');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformBlock } = require('../../util/merge');

module.exports = {
    Query: {
        async getBlocks(_, { sort, filter, skip, limit }) {
            try {
                let blocks = await Block
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return blocks.map(block => transformBlock(block));
            } catch (err) {
                console.log(err);
            }
        },
        async getBlock(_, { blockId }){
            try {
                let block = await Block.findById(blockId);
                return transformBlock(block);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createBlock: requiresAuth.createResolver(async (_, { partId, ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const blocks = await Block.find({ part: partId });
                const blockSize = blocks.map(block => block.size).reduce((prev, curr) => prev + curr, 0);
                if(blockSize > 4) throw new Error('size out of range');
                const newBlock = new Block({
                    part: partId,
                    ...params,
                    index: blocks.length,
                    contents: [],
                    createdBy: _id
                });
                const savedBlock = await newBlock.save();
                await Part.findByIdAndUpdate(partId, { $push: { blocks: savedBlock._id } });
                return {
                    OK: true,
                    errors,
                    block: transformBlock(savedBlock)
                };
            } catch(err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateBlock: requiresAuth.createResolver(async (_, {
            blockId, ...params
        }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    size: oldSize,
                } = await Block.findById(blockId);

                if(params.size === undefined || oldSize === params.size)
                    delete params.size;

                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Block has not change.'
                    }]
                };
                const updatedBlock = await Block.findByIdAndUpdate(blockId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    block: transformBlock(updatedBlock)
                };
            } catch (err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        moveBlock: requiresAuth.createResolver(async (_, { blockId,  index}) => {
            try {
                let block = await Block.findById(blockId);
                const blocks = await Block.find({
                    part: block.part
                });
                if(index < 0 || index > blocks.length - 1)
                    throw new Error('Index out of range');
                let oldIndex = block.index;
                block.index = index;
                await Block.updateMany({
                    $and: [
                        {_id: {$ne: blockId}},
                        {part: block.part},
                        {index: {$gte: oldIndex}}
                    ]
                }, {
                    $inc: {index: -1}
                });
                await Block.updateMany({
                    $and: [
                        {_id: {$ne: blockId}},
                        {part: block.part},
                        {index: {$gte: index}}
                    ]
                }, {
                    $inc: {index: 1}
                });
                await block.save();
                let editedBlocks = await Block.find({
                    part: block.part
                }).sort({index: 1});
                editedBlocks = editedBlocks.map(block => transformBlock(block));
                return editedBlocks;
            } catch(err) {
                console.log(err);
                throw new Error(err);
            }
        }),
        deleteBlock: requiresAuth.createResolver(async (_, { blockId }) => {
            try{
                const { part, index, contents: contentsId } = await Block.findByIdAndDelete(blockId);
                await Block.updateMany(
                    { $and: [
                        { index: { $gte: index } },
                        { part: { $eq: part } }
                    ] },
                    { $inc: { index: -1 } }
                );
                if(part) await Part.findOneAndUpdate(
                    { _id: part },
                    { $pull: { blocks: blockId } }
                );
                if(contentsId.length) {
                    const contents = await Content.find({  _id: { $in: contentsId } });
                    const imagesId = contents.filter(content => !!content.image).map(content => content.image);
                    await Content.deleteMany({ _id: { $in: contentsId }});
                    if(imagesId.length){
                        await Image.updateMany(
                            { _id: { $in: imagesId } },
                            { $pull: { contents: { $in: contentsId } } }
                        );
                    }
                }
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}