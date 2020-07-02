module.exports = `
    type Content{
        _id: ID!
        index: Int!
        block: Block!
        paddingTop: Int!
        type: String!
        image: Image
        color: String
        variant: String
        textAlign: String!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }
`;