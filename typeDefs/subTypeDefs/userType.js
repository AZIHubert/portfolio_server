module.exports = `
    type User{
        _id: ID!
        username: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        createdAt: String!
        isAdmin: Boolean!
        profilePicture: Image
    }
    type registerResponse{
        OK: Boolean!
        user: User
        errors: [Error!]
    }
    type loginResponse{
        OK: Boolean!
        token: String
        refreshToken: String
        errors: [Error]
    }
    
    type Query{
        getUsers: [User]!
        getUser(userId: ID!): User!
    }
    type Mutation{
        createUser(email: String!, username: String!, password: String!, confirmPassword: String!, firstName: String!, lastName: String!, passwordRegistration: String!): registerResponse!
        loginUser(emailOrUsername: String!, password: String!): loginResponse!
    }
`;