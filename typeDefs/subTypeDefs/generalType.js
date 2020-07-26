module.exports = `
    type General{
        biography: String
        email: String
        phone: String
        facebook: String
        instagram: String
        linkeding: String
        adressStreet: String
        adressZip: String
        adressCountry: String
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
        editGeneral(
            biography: String
            email: String
            phone: String
            facebook: String
            instagram: String
            linkeding: String
            adressStreet: String
            adressZip: String
            adressCountry: String
        ): generalResponse!
    }
`;