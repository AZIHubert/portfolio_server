module.exports = `
    type Type{
        _id: ID!
        title: String!
        works: [Work!]
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }

    input TypeFilter {
        title: StringFilter
        date: IntFilter
        works: ArrayStringsFilter
        
        and: [TypeFilter!]
        or: [TypeFilter!]
        not: TypeFilter
    }

    enum TypeSortableField {
        title
        createdAt
        updatedAt
    }
    input TypeSort {
        field: TypeSortableField
        order: SortOrder = ASC
    }

    type createTypeResponse{
        OK: Boolean
        type: Type
        errors: [Error!]
    }
    type Query{
        getTypes(skip: Int, limit: Int, sort: [TypeSort!], filter: TypeFilter): [Type!]
        getType(typeId: ID): Type!
    }
    type Mutation{
        createType(title: String!): createTypeResponse!
        deleteType(typeId: ID!): Boolean!
    }
`;