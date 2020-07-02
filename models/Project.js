const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = new Schema({
    index: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        unique: true,
        required: 'Can\'t be empty',
        trim: true
    },
    date: Number,
    titleColor: {
        type: String,
        default: '#1e0a14'
    },
    display: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    parts: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'Type'
    }]
}, {
    timestamps: true
});

projectSchema.plugin(uniqueValidator, { message: '{PATH} already exist.' });

module.exports = model('Project', projectSchema);