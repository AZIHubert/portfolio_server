module.exports = `
    type emailResponse{
        OK: Boolean!
        errors: [Error!]
    }

    type Mutation{
        createEmail(
            email: String!
            firstname: String!
            lastname: String!
            object: String!
            body: String!
        ): emailResponse!
    }
`;