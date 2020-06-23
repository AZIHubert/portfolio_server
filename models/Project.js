const { model, Schema } = require('mongoose');

const projectSchema = new Schema({
    index: Number,
    title: String,
    date: Number,
    titleColor: String,
    display: Boolean,
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    parts: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    createdAt: String,
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

module.exports = model('Project', projectSchema);