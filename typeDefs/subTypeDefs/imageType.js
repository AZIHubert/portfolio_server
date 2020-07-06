module.exports = `
    type Image {
        _id: ID!
        filename: String!
        url: String!
        createdAt: String!
        uploadBy: User
        projects: [Project!]
        users: [User!]
        contents: [Content!]
    }
    type Query{
        getImages: [Image]!
        getImage(imageId: ID!): Image!
    }
    type Mutation{
        uploadImage(upload: Upload!): Image!
        deleteImage(imageId: ID): String!
    }
`;