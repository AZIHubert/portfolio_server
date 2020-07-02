module.exports = `
    type Type{
        _id: ID!
        title: String!
        projects: [Project!]
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }
`;