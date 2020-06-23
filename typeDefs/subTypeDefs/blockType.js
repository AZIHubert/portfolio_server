module.exports = `
    type Block{
        _id: ID!
        part: Part!
        index: Int!
        size: Int!
        contents: [Content]
        createdAt: String!
        createdBy: User!
        editedAt: String
        editedBy: User
    }
`;