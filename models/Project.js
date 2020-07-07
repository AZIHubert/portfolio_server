const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = new Schema({
    title: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: 'Can\'t be empty',
        maxlength: [50, 'Need to be at most 50 characters'],
        trim: true
    },
    titleColor: {
        type: String,
        default: '#1e0a14'
    },
    index: {
        type: Number,
        default: 0
    },
    date: Number,
    display: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    parts: [{
        type: Schema.Types.ObjectId,
        ref: 'Part'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
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