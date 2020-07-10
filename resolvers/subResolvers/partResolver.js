const Part = require('../../models/Part');
const Work = require('../../models/Work');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformPart } = require('../../util/merge');

module.exports = {
    Query: {
        async getParts(_, { skip, limit }) {
            try {
                let parts = await Part
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
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
        createWork: requiresAuth.createResolver(async (_, { workId, ...params }, { user: { _id } }) => {
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
    }
}