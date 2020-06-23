const { model, Schema } = require('mongoose');

const workshopSchema = new Schema({
    artist: String,
    artistLink: String,
    body: String,
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

module.exports = model('Workshop', workshopSchema);