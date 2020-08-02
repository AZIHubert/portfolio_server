module.exports = `
    type Content{
        _id: ID!
        index: Int!
        block: Block!
        paddingTop: Int!
        type: String!
        image: Image
        color: String
        variant: String
        textAlign: String
        body: String
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input ContentFilter {
        block: StringFilter
        index: IntFilter
        type: StringFilter
        
        and: [ContentFilter!]
        or: [ContentFilter!]
        not: ContentFilter
    }

    enum ContentSortableField {
        index
    }
    input ContentSort {
        field: ContentSortableField
        order: SortOrder = ASC
    }

    type contentResponse{
        OK: Boolean!
        content: Content
        errors: [Error!]
    }
    type moveContentResponse {
        OK: Boolean
        contents: [Content!]
        errors: [Error!]
    }

    type Query{
        getContents(skip: Int, limit: Int, sort: [ContentSort!], filter: ContentFilter): [Content!]
        getContent(contentId: ID): Content!
    }

    type Mutation{
        createContent(
            blockId: ID!
            paddingTop: Int!
            type: String!
            image: ID
            color: String
            variant: String
            textAlign: String
            body: String
        ): contentResponse!
        updateContent(
            contentId: ID!
            paddingTop: Int
            type: String
            image: ID
            color: String
            variant: String
            textAlign: String
            body: String
        ): contentResponse!
        moveContent(contentId: ID! index: Int!): moveContentResponse!
        deleteContent(contentId: ID!): Boolean!
    }
`;