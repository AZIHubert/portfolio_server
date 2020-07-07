const Type = require('../../models/Type');
const Project = require('../../models/Project');
const { requiresAuth } = require('../../util/permissions');
const { transformType } = require('../../util/merge');

module.exports = {
    Query: {
        async getTypes() {
            try {
                let types = await Type.find();
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
        deleteType: requiresAuth.createResolver(async (_, { typeId }) => {
            try{
                const { projects } = await Type.findByIdAndDelete(typeId);
                if(projects.length) await Project.updateMany(
                    { _id: { $in: projects } },
                    {  $pull: { types: typeId } }
                );
                return true;
            } catch(err) {
                return false;
            }
        })
    }
}