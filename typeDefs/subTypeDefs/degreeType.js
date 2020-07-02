module.exports = `
    type Degree{
        _id: ID!
        city: String!
        degree: String!
        school: String!
        schoolLink: String!
        year: Int!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }
`;