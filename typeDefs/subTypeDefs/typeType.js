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
    type createTypeResponse{
        OK: Boolean
        type: Type
        errors: [Error!]
    }
    type Query{
        getTypes: [Type!]
        getType(typeId: ID): Type!
    }
    type Mutation{
        createType(title: String!): createTypeResponse!
    }
`;