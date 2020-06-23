const { model, Schema } = require('mongoose');

const imageSchema = new Schema({
    filename: String,
    url: String,
    uploadAt: String,
    uploadBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    contents: [{
        type: Schema.Types.ObjectId,
        ref: 'Content'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = model('Image', imageSchema);