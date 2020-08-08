module.exports = `
    type Type{
        _id: ID!
        title: String!
        works: [Work!]
        createdBy: User!
        createdAt: String!
        updatedBy: User
        updatedAt: String!
    }

    input TypeFilter {
        _id: StringFilter
        title: StringFilter
        works: ArrayStringsFilter
        createdBy: StringFilter
        createdAt: StringFilter
        updatedBy: StringFilter
        updatedAt: StringFilter
        
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

    type typeResponse{
        OK: Boolean
        type: Type
        errors: [Error!]
    }
    type Query{
        getTypes(skip: Int, limit: Int, sort: [TypeSort!], filter: TypeFilter): [Type!]
        getType(typeId: ID): Type!
    }
    type Mutation{
        createType(title: String!): typeResponse!
        updateType(typeId: ID! title: String): typeResponse!
        deleteType(typeId: ID!): Boolean!
    }
`;