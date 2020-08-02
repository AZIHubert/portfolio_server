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
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input WorkFilter {
        index: IntFilter
        title: StringFilter
        titleColor: StringFilter
        date: IntFilter
        display: Boolean
        types: ArrayStringsFilter
        parts: ArrayStringsFilter
        
        and: [WorkFilter!]
        or: [WorkFilter!]
        not: WorkFilter
    }

    enum WorkSortableField {
        index
        title
        titleColor
        date
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