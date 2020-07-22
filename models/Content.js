const { model, Schema } = require('mongoose');

const contentSchema = new Schema({
    block: {
        type: Schema.Types.ObjectId,
        ref: 'Block'
    },
    index: {
        type: Number,
        required: true
    },
    paddingTop: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    color: String,
    variant: String,
    textAlign: String,
    body: String,
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

module.exports = model('Content', contentSchema);