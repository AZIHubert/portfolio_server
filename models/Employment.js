const { model, Schema } = require('mongoose');

const employmentSchema = new Schema({
    body: String,
    city: String,
    company: String,
    companyLink: String,
    yearFrom: Number,
    yearTo: Number,
    currentWork: Boolean,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editedAt: String,
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Employment', employmentSchema);