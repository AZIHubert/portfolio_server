module.exports = `
    type Work{
        _id: ID!
        index: Int!
        title: String!
        titleColor: String!
        date: Int!
        types: [Type!]
        display: Boolean!
        thumbnail: Image
        parts: [Part]
        createdBy: User!
        createdAt: String!
        updatedBy: User
        updatedAt: String!
    }

    input WorkFilter {
        _id: StringFilter
        index: IntFilter
        title: StringFilter
        titleColor: StringFilter
        date: IntFilter
        types: ArrayStringsFilter
        display: Boolean
        thumbnail: StringFilter
        parts: ArrayStringsFilter
        createdBy: StringFilter
        createdAt: StringFilter
        updatedBy: StringFilter
        updatedAt: StringFilter
        
        and: [WorkFilter!]
        or: [WorkFilter!]
        not: WorkFilter
    }

    enum WorkSortableField {
        index
        title
        titleColor
        date
        display
        createdAt
        updatedAt
    }
    input WorkSort {
        field: WorkSortableField
        order: SortOrder = ASC
    }

    type WorkResponse{
        OK: Boolean!
        work: Work
        errors: [Error!]
    }
    type MoveWorkResponse {
        OK: Boolean
        works: [Work!]
        errors: [Error!]
    }

    type Query{
        getWorks(
            skip: Int
            limit: Int
            sort: [WorkSort!]
            filter: WorkFilter
        ): [Work!]
        getWork(workId: ID): Work!
    }
    type Mutation{
        createWork(
            title: String!
            date: Int
            titleColor: String
            display: Boolean
            types: [ID]
            thumbnail: ID
        ): WorkResponse!
        updateWork(
            workId: ID!
            title: String
            date: Int
            titleColor: String
            display: Boolean
            types: [ID!]
            thumbnail: ID
        ): WorkResponse!
        moveWork(workId: ID! index: Int!): MoveWorkResponse!
        deleteWork(workId: ID!): Boolean!
    }
`;