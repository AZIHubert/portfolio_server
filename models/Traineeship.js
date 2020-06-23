const { model, Schema } = require('mongoose');

const traineeshipSchema = new Schema({
    body: String,
    city: String,
    company: String,
    companyLink: String,
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

module.exports = model('Traineeship', traineeshipSchema);