module.exports = `
    type Project{
        _id: ID!
        index: Int!
        title: String!
        titleColor: String!
        date: Int!
        display: Boolean!
        thumbnail: Image
        parts: [Part]
        createdAt: String!
        createdBy: User!
        editedAt: String
        editedBy: User
    }
`;