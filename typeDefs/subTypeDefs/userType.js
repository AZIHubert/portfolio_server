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
    
    type userResponse{
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
    type deleteResonse{
        OK: Boolean!
        errors: [Error!]
    }
    
    type Query{
        getUsers: [User!]
        getUser(userId: ID!): User!
    }
    type Mutation{
        createUser(
            email: String!
            username: String!
            password: String!
            confirmPassword: String!
            firstname: String!
            lastname: String!
            passwordRegistration: String!
        ): userResponse!
        updateUser(
            userId: ID!
            username: String
            firstname: String
            lastname: String
            profilePicture: ID
        ): userResponse!
        updateUserEmail(
            userId: ID!
            email: String!
        ): userResponse!
        updateUserPassword(
            userId: ID!
            oldPassword: String!
            password: String!
        ): loginResponse!
        updateUserAdmin(
            userId: ID!
            adminRegistrationPassword: String!
        ): loginResponse!
        loginUser(emailOrUsername: String!, password: String!): loginResponse!
        deleteUser(userId: ID! password: String!): deleteResonse!
    }
`;