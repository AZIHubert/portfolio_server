const { model, Schema } = require('mongoose');

const traineeshipSchema = new Schema({
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

module.exports = model('Traineeship', traineeshipSchema);