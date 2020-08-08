module.exports = `
    type Image {
        _id: ID!
        filename: String!
        url: String!
        width: Int!
        height: Int!
        size: String!
        works: [Work!]
        users: [User!]
        contents: [Content!]
        title: String
        createdBy: User
        createdAt: String!
        updatedBy: User
        updatedAt: String!
    }

    input ImageFilter {
        _id: StringFilter
        filename: StringFilter
        url: StringFilter
        width: StringFilter
        height: StringFilter
        size: StringFilter
        works: StringFilter
        users: StringFilter
        contents: StringFilter
        title: StringFilter
        createdBy: StringFilter
        createdAt: StringFilter
        updatedBy: StringFilter
        updatedAt: StringFilter
        
        and: [ImageFilter!]
        or: [ImageFilter!]
        not: ImageFilter
    }

    enum ImageSortableField {
        filename
        url
        width
        height
        size
        title
        createdAt
        updatedAt
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
        getImages(
            skip: Int
            limit: Int
            sort: [ImageSort!]
            filter: ImageFilter
        ): [Image]!
        getImage(imageId: ID!): Image!
    }
    type Mutation{
        createImage(upload: Upload!): imageResponse!
        updateImage(imageId: ID! title: String): imageResponse!
        deleteImage(imageId: ID): Boolean!
    }
`;