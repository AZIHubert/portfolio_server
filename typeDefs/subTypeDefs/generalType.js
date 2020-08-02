module.exports = `
    type General{
        biography: String
        email: String
        phone: String
        facebook: String
        instagram: String
        linkedin: String
        adressStreet: String
        adressZip: String
        adressCountry: String
        updatedAt: String
        updatedBy: User
    }

    type generalResponse{
        OK: Boolean!
        general: General
        errors: [Error!]
    }

    type Query{
        getGeneral: General!
    }
    type Mutation{
        updateGeneral(
            email: String
            phone: String
            biography: String
            facebook: String
            instagram: String
            linkedin: String
            adressStreet: String
            adressZip: String
            adressCountry: String
        ): generalResponse!
    }
`;