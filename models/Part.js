const { model, Schema } = require('mongoose');

const partSchema = new Schema({
    work: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Work'
    },
    index: {
        type: Number,
        default: 0
    },
    justifyContent: {
        type: String,
        default: 'flex-start'
    },
    alignItems: {
        type: String,
        default: 'flex-start'
    },
    disablePaddingSm: {
        type: String,
        default: true
    },
    paddingTop: {
        type: Number,
        default: 0,
        min: [0, 'Minimum padding is 0'],
        max: [10, 'Maximum padding is 10']
    },
    paddingBottom: {
        type: Number,
        default: 0,
        min: [0, 'Minimum padding is 0'],
        max: [10, 'Maximum padding is 10']
    },
    spacing: {
        type: Number,
        default: 0,
        min: [1, 'Minimum spacing is 1'],
        max: [5, 'Maximum padding is 5']
    },
    blocks: [{
        type: Schema.Types.ObjectId,
        ref: 'block'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = model('Part', partSchema);