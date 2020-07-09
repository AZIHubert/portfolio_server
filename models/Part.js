const { model, Schema } = require('mongoose');

const partSchema = new Schema({
    work: {
        type: Schema.Types.ObjectId,
        ref: 'Work'
    },
    index: Number,
    justifyContent: String,
    alignItems: String,
    disablePaddingSm: Boolean,
    paddingTop: Number,
    paddingBottom: Number,
    spacing: Number,
    blocks: {
        type: Schema.Types.ObjectId,
        ref: 'block'
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

module.exports = model('Part', partSchema);