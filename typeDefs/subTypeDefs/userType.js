module.exports = `
    type User{
        _id: ID!
        username: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        createdAt: String!
        admin: Boolean!
        profilePicture: Image
    }
    type Query{
        getUsers: [User]!
        getUser(userId: ID!): User!
    }
`;