const { model, Schema } = require('mongoose');

const generalSchema = new Schema({
    biography: String,
    email: String,
    phone: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    adressStreat: String,
    adressZip: String,
    adressCountry: String
});

module.exports = model('General', generalSchema);