module.exports = `
    type Employment{
        _id: ID!
        body: String!
        city: String!
        company: String!
        companyLink: String!
        yearFrom: Int!
        yearTo: Int
        currentWork: Boolean!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }
`;