const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: String,
    admin: Boolean,
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }
});

module.exports = model('User', userSchema);