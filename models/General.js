const { model, Schema } = require('mongoose');

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.trim() === '') return true;
    return re.test(email);
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
    adressStreet: {
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
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = model('General', generalSchema);