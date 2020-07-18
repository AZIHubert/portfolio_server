const Part = require('../../models/Part');
const Work = require('../../models/Work');
const Block = require('../../models/Block');
const Content = require('../../models/Content');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformPart } = require('../../util/merge');

module.exports = {
    Query: {
        async getParts(_, { sort, filter, skip, limit }) {
            try {
                let parts = await Part
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return parts.map(part => transformPart(part));
            } catch (err) {
                console.log(err);
            }
        },
        async getPart(_, { partId }){
            try {
                let part = await Part.findById(partId);
                return transformPart(part);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createPart: requiresAuth.createResolver(async (_, { workId, ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const parts = await Part.find({ work: workId });
                const newPart = new Part({
                    work: workId,
                    ...params,
                    index: parts.length,
                    blocks: [],
                    createdBy: _id
                });
                const savedPart = await newPart.save();
                await Work.findByIdAndUpdate(workId, { $push: { parts: savedPart._id } });
                return {
                    OK: true,
                    errors,
                    part: transformPart(savedPart)
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
            partId, ...params
        }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    backgroundColor: oldBackgroundColor,
                    justifyContent: oldJustifyContent,
                    alignItems: oldAlignItems,
                    disablePaddingSm: oldDisablePaddingSm,
                    paddingTop: oldPaddingTop,
                    paddingBottom: oldPaddingBottom,
                    spacing: oldSpacing
                } = await Part.findById(partId);

                if(params.backgroundColor === undefined || oldBackgroundColor === params.backgroundColor)
                    delete params.backgroundColor;
                if(params.justifyContent === undefined || oldJustifyContent === params.justifyContent)
                    delete params.justifyContent;
                if(params.alignItems === undefined || oldAlignItems === params.alignItems)
                    delete params.alignItems;
                if(params.disablePaddingSm === undefined || oldAlignItems === params.disablePaddingSm)
                    delete params.disablePaddingSm;
                if(params.paddingTop === undefined || oldPaddingTop === params.paddingTop)
                    delete params.paddingTop;
                if(params.paddingBottom === undefined || oldPaddingBottom === params.paddingBottom)
                    delete params.paddingBottom;
                if(params.spacing === undefined || oldSpacing === params.spacing)
                    delete params.spacing;

                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Part has not change.'
                    }]
                };
                console.log(params);
                const updatedPart = await Part.findByIdAndUpdate(partId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    work: transformPart(updatedPart)
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
        movePart: requiresAuth.createResolver(async (_, { partId,  index}) => {
            try {
                let part = await Part.findById(partId);
                const parts = await Part.find({
                    work: part.work
                });
                if(index < 0 || index > parts.length - 1)
                    throw new Error('Index out of range');
                let oldIndex = part.index;
                part.index = index;
                await Part.updateMany({
                    $and: [
                        {_id: {$ne: partId}},
                        {work: part.work},
                        {index: {$gte: oldIndex}}
                    ]
                }, {
                    $inc: {index: -1}
                });
                await Part.updateMany({
                    $and: [
                        {_id: {$ne: partId}},
                        {work: part.work},
                        {index: {$gte: index}}
                    ]
                }, {
                    $inc: {index: 1}
                });
                await part.save();
                let editedParts = await Part.find({
                    work: part.work
                }).sort({index: 1});
                editedParts = editedParts.map(part => transformPart(part));
                return editedParts;
            } catch(err) {
                console.log(err);
                throw new Error(err);
            }
        }),
        deletePart: requiresAuth.createResolver(async (_, { partId }) => {
            try{
                const { work, index, blocks } = await Part.findByIdAndDelete(partId);
                await Part.updateMany(
                    { index: { $gte: index } },
                    { $inc: { index: -1 } }
                );
                if(work) {
                    await Work.findOneAndUpdate(
                        { _id: work },
                        { $pull: { parts: partId } }
                    );
                }
                if(blocks.length) {
                    const contents = Block.find({  _id: { $in: blocks } })
                        .map(block => block.contents)
                        .reduce((prev, curr) => prev.concat(curr));
                    Block.deleteMany({  _id: { $in: blocks } });
                    if(contents.length) Content.deleteMany({ _id: { $in: contents }});
                }
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}