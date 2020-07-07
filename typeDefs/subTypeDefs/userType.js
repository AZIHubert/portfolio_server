module.exports = `
    type User{
        _id: ID!
        username: String!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
        isAdmin: Boolean!
        profilePicture: Image
        isActive: Boolean!
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
        errors: [Error!]
    }
    
    type Query{
        getUsers: [User!]
        getUser(userId: ID!): User!
    }
    type Mutation{
        createUser(email: String!, username: String!, password: String!, confirmPassword: String!, firstname: String!, lastname: String!, passwordRegistration: String!): registerResponse!
        loginUser(emailOrUsername: String!, password: String!): loginResponse!
    }
`;