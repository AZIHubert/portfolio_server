module.exports = `
    type Part{
        _id: ID!
        work: Work!
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
        updatedAt: String
        updatedBy: User
    }
`;