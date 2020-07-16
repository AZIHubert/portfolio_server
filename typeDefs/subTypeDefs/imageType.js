module.exports = `
    type Image {
        _id: ID!
        filename: String!
        url: String!
        width: Int!
        height: Int!
        size: String!
        createdAt: String!
        createdBy: User
        works: [Work!]
        users: [User!]
        contents: [Content!]
    }
    type Query{
        getImages: [Image]!
        getImage(imageId: ID!): Image!
    }
    type Mutation{
        uploadImage(upload: Upload!): Image!
        deleteImage(imageId: ID): Boolean!
    }
`;