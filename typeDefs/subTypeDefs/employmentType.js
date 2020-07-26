module.exports = `
    type Employment{
        _id: ID!
        body: String
        city: String!
        company: String!
        companyLink: String
        yearFrom: Int!
        yearTo: Int
        currentWork: Boolean!
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input EmploymentFilter {
        city: StringFilter
        company: StringFilter
        yearFrom: IntFilter
        yearTo: IntFilter
        currentWork: Boolean
        createdBy: StringFilter
        updatedBy: StringFilter
        
        and: [EmploymentFilter!]
        or: [EmploymentFilter!]
        not: EmploymentFilter
    }

    enum EmploymentSortableField {
        city
        company
        yearFrom
        yearTo
        createdBy
        updatedBy
    }
    input EmploymentSort {
        field: EmploymentSortableField
        order: SortOrder = ASC
    }

    type employmentResponse{
        OK: Boolean!
        employment: Employment
        errors: [Error!]
    }

    type Query{
        getEmployments(skip: Int, limit: Int, sort: [EmploymentSort!], filter: EmploymentFilter): [Employment!]
        getEmployment(employmentId: ID!): Employment!
    }

    type Mutation{
        createEmployment(
            body: String
            city: String!
            company: String!
            companyLink: String
            yearFrom: Int!
            yearTo: Int
            currentWork: Boolean!
        ): employmentResponse!
        updateEmployment(
            employmentId: ID!
            body: String
            city: String
            company: String
            companyLink: String
            yearFrom: Int
            yearTo: Int
            currentWork: Boolean!
        ): employmentResponse!
        deleteEmployment(employmentId: ID!): Boolean!
    }
`;