const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const degreeSchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    school: {
        type: String,
        required: true,
        trim: true
    },
    schoolLink: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

degreeSchema.plugin(uniqueValidator, { message: '{PATH} already exist.' });

module.exports = model('Degree', degreeSchema);