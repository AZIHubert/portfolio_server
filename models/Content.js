const { model, Schema } = require('mongoose');

const blockSchema = new Schema({
    block: {
        type: Schema.Types.ObjectId,
        ref: 'Block'
    },
    index: Number,
    paddingTop: Number,
    type: String,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    color: String,
    variant: String,
    textAlign: String,
    body: String,
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

module.exports = model('Block', blockSchema);