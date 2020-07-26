module.exports = `
    type Degree{
        _id: ID!
        city: String!
        degree: String!
        school: String!
        schoolLink: String
        year: Int!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input DegreeFilter {
        degree: StringFilter
        school: StringFilter
        year: IntFilter
        createdBy: StringFilter
        updatedBy: StringFilter
        
        and: [DegreeFilter!]
        or: [DegreeFilter!]
        not: DegreeFilter
    }

    enum DegreeSortableField {
        city
        degree
        school
        year
        createdBy
        updatedBy
    }
    input DegreeSort {
        field: DegreeSortableField
        order: SortOrder = ASC
    }

    type degreeResponse{
        OK: Boolean!
        degree: Degree
        errors: [Error!]
    }

    type Query{
        getDegrees(skip: Int, limit: Int, sort: [DegreeSort!], filter: DegreeFilter): [Degree!]
        getDegree(degreeId: ID): Degree!
    }

    type Mutation{
        createDegree(
            city: String!
            degree: String!
            school: String!
            schoolLink: String
            year: Int!
        ): degreeResponse!
        updateDegree(
            degreeId: ID!
            city: String
            degree: String
            school: String
            schoolLink: String
            year: Int
        ): degreeResponse!
        deleteDegree(degreeId: ID!): Boolean!
    }
`;