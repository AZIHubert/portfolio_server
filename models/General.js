const { model, Schema } = require('mongoose');

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const generalSchema = new Schema({
    biography: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    adressStreat: {
        type: String,
        default: ''
    },
    adressZip: {
        type: String,
        default: ''
    },
    adressCountry: {
        type: String,
        default: ''
    }
});

module.exports = model('General', generalSchema);