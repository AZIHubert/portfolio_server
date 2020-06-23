module.exports = `
    type Image {
        _id: ID!
        filename: String!
        url: String!
        uploadAt: String!
        uploadBy: User!
        projects: [Project]
        user: User
        contents: [Content]
    }
    type Query{
        getImages: [Image]!
        getImage(imageId: ID!): Image!
    }
`;