const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = new Schema({
    index: Number,
    title: {
        type: String,
        unique: true,
        required: 'Can\'t be empty',
        trim: true
    },
    date: Number,
    titleColor: {
        type: String,
        default: '#000000'
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
    }
}, {
    timestamps: true
});

projectSchema.plugin(uniqueValidator, { message: '{PATH} already exist.' });

module.exports = model('Project', projectSchema);