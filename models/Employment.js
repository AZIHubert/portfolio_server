const { model, Schema } = require('mongoose');

const employmentSchema = new Schema({
    body: String,
    city: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    companyLink: {
        type: String,
        trim: true
    },
    yearFrom: {
        type: Number,
        required: true
    },
    yearTo: Number,
    currentWork: {
        type: Boolean,
        required: true
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

module.exports = model('Employment', employmentSchema);