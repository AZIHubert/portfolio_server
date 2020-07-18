const Block = require('../../models/Block');
const Part = require('../../models/Part');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformBlock } = require('../../util/merge');

module.exports = {
    Query: {
        async getBlock(_, { sort, filter, skip, limit }) {
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
                    part: transformBlock(savedBlock)
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
        updatePart: requiresAuth.createResolver(async (_, {
            blockId, ...params
        }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    size: oldSize,
                } = await Part.findById(partId);

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
                    work: transformBlock(updatedBlock)
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
        movePart: requiresAuth.createResolver(async (_, { partId,  index}) => {}),
        deletePart: requiresAuth.createResolver(async (_, { blockId }) => {
            try{
                const { part, index } = await Block.findByIdAndDelete(blockId);
                await Block.updateMany(
                    { index: { $gte: index } },
                    { $inc: { index: -1 } }
                );
                if(part) {
                    await Part.findOneAndUpdate(
                        { _id: part },
                        { $pull: { blocks: blockId } }
                    );
                }
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}