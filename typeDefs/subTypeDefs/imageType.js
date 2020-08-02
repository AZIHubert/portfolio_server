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
        title: String
    }

    enum ImageSortableField {
        title
        createdAt
        filename
        width
        height
    }
    input ImageSort {
        field: ImageSortableField
        order: SortOrder = ASC
    }

    type imageResponse{
        OK: Boolean!
        image: Image
        errors: [Error!]
    }

    type Query{
        getImages(skip: Int, limit: Int, sort: [ImageSort!]): [Image]!
        getImage(imageId: ID!): Image!
    }
    type Mutation{
        createImage(upload: Upload!): imageResponse!
        updateImage(imageId: ID! title: String): imageResponse!
        deleteImage(imageId: ID): Boolean!
    }
`;