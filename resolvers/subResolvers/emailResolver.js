const Email = require('../../models/Email');

module.exports = {
    Mutation: {
        createEmail: async (_, { ...params }) => {
            const errors = [];
            try {
                const newEmail = new Email({ ...params });
                const savedEmail = await newEmail.save();
                return { OK: true, errors };
            } catch (err) {
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
        }
    }
}