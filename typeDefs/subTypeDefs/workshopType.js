module.exports = `
    type Workshop{
        _id: ID!
        artist: String!
        artistLink: String
        body: String!
        year: Int!
        createdBy: User!
        createdAt: String!
        updatedBy: User
        updatedAt: String
    }

    input WorkshopFilter {
        _id: StringFilter
        artist: StringFilter
        artistLink: StringFilter
        body: StringFilter
        year: IntFilter
        createdBy: StringFilter
        createdAt: StringFilter
        updatedBy: StringFilter
        updatedAt: StringFilter
        
        and: [WorkshopFilter!]
        or: [WorkshopFilter!]
        not: WorkshopFilter
    }

    enum WorkshopSortableField {
        artist
        artistLink
        body
        year
        createdAt
        updatedAt
    }
    input WorkshopSort {
        field: WorkshopSortableField
        order: SortOrder = ASC
    }

    type workshopResponse{
        OK: Boolean!
        workshop: Workshop
        errors: [Error!]
    }

    type Query{
        getWorkshops(skip: Int, limit: Int, sort: [WorkshopSort!], filter: WorkshopFilter): [Workshop!]
        getWorkshop(workshopId: ID): Workshop!
    }

    type Mutation{
        createWorkshop(
            artist: String!
            artistLink: String
            body: String!
            year: Int!
        ): workshopResponse!
        updateWorkshop(
            workshopId: ID!
            artist: String
            artistLink: String
            body: String
            year: Int
        ): workshopResponse!
        deleteWorkshop(workshopId: ID!): Boolean!
    }
`;