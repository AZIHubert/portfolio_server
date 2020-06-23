const { model, Schema } = require('mongoose');

const degreeSchema = new Schema({
    city: String,
    degree: String,
    school: String,
    schoolLink: String,
    year: Number,
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

module.exports = model('Degree', degreeSchema);