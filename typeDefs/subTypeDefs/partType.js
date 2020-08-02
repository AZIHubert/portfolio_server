module.exports = `
    type Part{
        _id: ID!
        work: Work!
        index: Int!
        justifyContent: String!
        backgroundColor: String!
        disableBackground: Boolean!
        alignItems: String!
        disablePaddingSm: Boolean!
        paddingTop: Int!
        paddingBottom: Int!
        spacing: Int!
        blocks: [Block!]
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input PartFilter {
        work: StringFilter
        justifyContent: StringFilter
        alignItems: StringFilter
        disablePaddingSm: Boolean
        paddingTop: IntFilter
        paddingBottom: IntFilter
        blocks: ArrayStringsFilter
        
        and: [PartFilter!]
        or: [PartFilter!]
        not: PartFilter
    }

    enum PartSortableField {
        index
    }
    input PartSort {
        field: PartSortableField
        order: SortOrder = ASC
    }

    type partResponse {
        OK: Boolean!
        part: Part
        errors: [Error!]
    }
    type movePartResponse {
        OK: Boolean
        parts: [Part!]
        errors: [Error!]
    }

    type Query{
        getParts(skip: Int, limit: Int, sort: [PartSort!], filter: PartFilter): [Part!]
        getPart(partId: ID): Part!
    }
    type Mutation{
        createPart(
            workId: ID!
            backgroundColor: String
            justifyContent: String
            disableBackground: Boolean!
            alignItems: String
            disablePaddingSm: Boolean
            paddingTop: Int
            paddingBottom: Int
            spacing: Int
        ): partResponse!
        updatePart(
            partId: ID!
            backgroundColor: String
            justifyContent: String
            disableBackground: Boolean
            alignItems: String
            disablePaddingSm: Boolean
            paddingTop: Int
            paddingBottom: Int
            spacing: Int
        ): partResponse!
        movePart(partId: ID!, index: Int!): movePartResponse!
        deletePart(partId: ID!): Boolean!
    }
`;