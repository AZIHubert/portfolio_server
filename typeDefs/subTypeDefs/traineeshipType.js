module.exports = `
    type Traineeship{
        _id: ID!
        body: String
        city: String!
        company: String!
        companyLink: String
        year: Int!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input TraineeshipFilter {
        _id: StringFilter
        city: StringFilter
        company: StringFilter
        year: IntFilter
        createdBy: StringFilter
        updatedBy: StringFilter
        
        and: [TraineeshipFilter!]
        or: [TraineeshipFilter!]
        not: TraineeshipFilter
    }

    enum TraineeshipSortableField {
        city
        company
        year
        createdBy
        updatedBy
    }
    input TraineeshipSort {
        field: TraineeshipSortableField
        order: SortOrder = ASC
    }

    type traineeshipResponse{
        OK: Boolean!
        traineeship: Traineeship
        errors: [Error!]
    }

    type Query{
        getTraineeships(skip: Int, limit: Int, sort: [TraineeshipSort!], filter: TraineeshipFilter): [Traineeship!]
        getTraineeship(traineeshipId: ID): Traineeship!
    }

    type Mutation{
        createTraineeship(
            body: String
            city: String!
            company: String!
            companyLink: String
            year: Int!
        ): traineeshipResponse!
        updateTraineeship(
            traineeshipId: ID!
            body: String
            city: String
            company: String
            companyLink: String
            year: Int
        ): traineeshipResponse!
        deleteTraineeship(traineeshipId: ID!): Boolean!
    }
`;