const { model, Schema } = require('mongoose');

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.trim() === '') return true;
    return re.test(email);
};

const emailSchema = new Schema({
    email: {
        type: String,
        required: 'Can\'t be empty',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    firstname: {
        type: String,
        trim: true,
        required: 'Can\'t be empty',
    },
    lastname: {
        type: String,
        trim: true,
        required:  'Can\'t be empty',
    },
    object: {
        type: String,
        trim: true,
        required:  'Can\'t be empty',
    },
    body: {
        type: String,
        required: 'Can\'t be empty',
        trim: true,
        minlength: [4, 'Need to be at least 4 characters']
    }
}, {
    timestamps: true
});

module.exports = model('Email', emailSchema);