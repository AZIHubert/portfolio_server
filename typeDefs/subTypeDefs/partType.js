module.exports = `
    type Part{
        _id: ID!
        project: Project!
        index: Int!
        justifyContent: String!
        alignItems: String!
        disablePaddingSm: Boolean!
        paddingTop: Int!
        paddingBottom: Int!
        spacing: Int!
        block: [Block]
        createdAt: String!
        createdBy: User!
        editedAt: String
        editedBy: User
    }
`;