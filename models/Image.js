const { model, Schema } = require('mongoose');

const imageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    works: [{
        type: Schema.Types.ObjectId,
        ref: 'Work'
    }],
    contents: [{
        type: Schema.Types.ObjectId,
        ref: 'Content'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = model('Image', imageSchema);