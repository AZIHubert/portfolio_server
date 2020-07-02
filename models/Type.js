const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const typeSchema = new Schema({
    title: {
        type: String,
        unique: true,
        require: 'Can\'t be empty',
        trim: true
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

typeSchema.plugin(uniqueValidator, { message: '{PATH} already exist.' });

module.exports = model('Type', typeSchema);