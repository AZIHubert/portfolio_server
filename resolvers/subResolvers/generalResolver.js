const General = require('../../models/General');
const { requiresAuth } = require('../../util/permissions');

module.exports = {
    Query: {
        getGeneral: async () => {
            try{
                let general = await General.findOne();
                if(!general) {
                    const newGeneral = new General();
                    general = await newGeneral.save();
                }
                return general
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        editGeneral: requiresAuth.createResolver(async (_, { ...params }) => {
            const errors = [];
            try {
                const existedGeneral = await General.findOne();
                let general;
                if(!!existedGeneral){
                    let {
                        biography: oldBiography,
                        email: oldEmail,
                        phone: oldPhone,
                        facebook: oldFacebook,
                        instagram: oldInstagram,
                        linkedin: oldLinkedin,
                        adressStreet: oldAdressStreet,
                        adressZip: oldAdressZip,
                        adressCountry: oldAdressCountry
                    } = existedGeneral
                    if(params.biography === undefined || oldBiography === params.biography)
                        delete params.biography;
                    if(params.email === undefined || oldEmail === params.email.trim())
                        delete params.email;
                    if(params.phone === undefined || oldPhone === params.phone.trim())
                        delete params.phone;
                    if(params.facebook === undefined || oldFacebook === params.facebook.trim())
                        delete params.facebook;
                    if(params.instagram === undefined || oldInstagram === params.instagram.trim())
                        delete params.instagram;
                    if(params.linkedin === undefined || oldLinkedin === params.linkedin.trim())
                        delete params.linkedin;
                    if(params.adressStreet === undefined || oldAdressStreet === params.adressStreet.trim())
                        delete params.adressStreet;
                    if(params.adressZip === undefined || oldAdressZip === params.adressZip.trim())
                        delete params.adressZip;
                    if(params.adressCountry === undefined || oldAdressCountry === params.adressCountry.trim())
                        delete params.adressCountry;
                    const updatedGeneral = { ...existedGeneral, ...params };
                    if(!Object.keys(params).length) return {
                        OK: false,
                        errors: [{
                            path: 'general',
                            message: 'General has not change.'
                        }]
                    };
                    general = await updatedGeneral.save();
                } else {
                    const newGeneral = new General({ ...params });
                    general = await newGeneral.save();
                }
                return {
                    OK: true,
                    errors,
                    general
                }
            } catch(err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        })
    }
};