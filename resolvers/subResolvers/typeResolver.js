const Type = require('../../models/Type');
const Work = require('../../models/Work');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformType } = require('../../util/merge');

module.exports = {
    Query: {
        async getTypes(_, { sort, filter, skip, limit }) {
            try {
                let types = await Type
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
                return types.map(type => transformType(type));
            } catch (err) {
                console.log(err);
            }
        },
        async getType(_, { typeId }){
            try {
                let type = await Type.findById(typeId);
                return transformType(type);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createType: requiresAuth.createResolver(async (_, { ...params }, { user: { _id }}) => {
            const errors = [];
            try {
                const newType = new Type({...params, createdBy: _id });
                const saveType = await newType.save();
                return {
                    OK: true,
                    errors,
                    type: transformType(saveType)
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
                        errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateType: requiresAuth.createResolver(async (_, { typeId, ...params }, { user: _id }) => {
            const errors = [];
            try {
                let { title: oldTitle } = await Type.findById(typeId);
                if(oldTitle === params.title) delete params.title;
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Work has not change.'
                    }]
                };
                const existedTitle = await Type.findOne({ title: params.title });
                if(existedTitle) return {
                    OK: false,
                    errors: [{
                        path: 'title',
                        message: 'Title already exist.'
                    }]
                };
                const updatedType = await Type.findByIdAndUpdate(typeId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    type: transformType(updatedType)
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
        deleteType: requiresAuth.createResolver(async (_, { typeId }) => {
            try{
                const { works } = await Type.findByIdAndDelete(typeId);
                if(works.length) await Work.updateMany(
                    { _id: { $in: works } },
                    {  $pull: { types: typeId } }
                );
                return true;
            } catch(err) {
                return false;
            }
        })
    }
}