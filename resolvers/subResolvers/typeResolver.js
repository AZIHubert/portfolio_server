const Type = require('../../models/Type');
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
        createType: async (_, { ...params }, context) => {
            const errors = [];
            try {
                const newType = new Type({...params});
                const saveType = await newType.save();
                return {
                    OK: true,
                    errors,
                    type: transformType(newType)
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
        },
    }
}