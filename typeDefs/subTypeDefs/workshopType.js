module.exports = `
    type Workshop{
        _id: ID!
        artist: String!
        artistLink: String
        body: String!
        year: Int!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input WorkshopFilter {
        artist: StringFilter
        year: IntFilter
        createdBy: StringFilter
        updatedBy: StringFilter
        
        and: [WorkshopFilter!]
        or: [WorkshopFilter!]
        not: WorkshopFilter
    }

    enum WorkshopSortableField {
        artist
        year
        createdBy
        updatedBy
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