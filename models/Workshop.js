const { model, Schema } = require('mongoose');

const workshopSchema = new Schema({
    artist: {
        type: String,
        required: true,
        trim: true
    },
    artistLink: {
        type: String,
        trim: true
    },
    body: String,
    year: Number,
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

module.exports = model('Workshop', workshopSchema);