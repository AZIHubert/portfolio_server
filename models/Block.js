const { model, Schema } = require('mongoose');

const blockSchema = new Schema({
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    index: Number,
    size: {
        type: Number,
        default: 0,
        min: [1, 'Minimum size is 1'],
        max: [4, 'Maximum size is 4']
    },
    contents: [{
        type: Schema.Types.ObjectId,
        ref: 'Content'
    }],
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