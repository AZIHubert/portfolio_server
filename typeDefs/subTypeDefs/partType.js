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
        blocks: [Block!]
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    type partResponse{
        OK: Boolean!
        part: Part
        errors: [Error!]
    }
    type Query{
        getParts(skip: Int, limit: Int): [Part!]
        getPart(partId: ID): Part!
    }
    type Mutation{
        createPart(
            workId: ID!
            justifyContent: String
            alignItems: String
            disablePaddingSm: Boolean
            paddingTop: Int
            paddingBottom: Int
            spacing: Int
        ): partResponse!
        movePart(partId: ID!, index: Int!): [Part!]!
        deletePart(partId: ID!): Boolean!
    }
`;