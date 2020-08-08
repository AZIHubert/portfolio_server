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
        createdBy: User!
        createdAt: String!
        updatedBy: User
        updatedAt: String!
    }

    input EmploymentFilter {
        _id: StringFilter
        body: StringFilter
        city: StringFilter
        company: StringFilter
        companyLink: StringFilter
        yearFrom: IntFilter
        yearTo: IntFilter
        currentWork: Boolean
        createdBy: StringFilter
        createdAt: StringFilter
        updatedBy: StringFilter
        updatedAt: StringFilter
        
        and: [EmploymentFilter!]
        or: [EmploymentFilter!]
        not: EmploymentFilter
    }

    enum EmploymentSortableField {
        body
        city
        company
        companyLink
        yearFrom
        yearTo
        currentWork
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