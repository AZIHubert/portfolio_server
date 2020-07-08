module.exports = `
    type Project{
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

    input ProjectFilter {
        index: IntFilter
        title: StringFilter
        titleColor: StringFilter
        date: IntFilter
        display: Boolean
        
        and: [ProjectFilter!]
        or: [ProjectFilter!]
        not: ProjectFilter
    }

    enum ProjectSortableField {
        index
        title
        titleColor
        date
        createdAt
        updatedAt
    }
    input ProjectSort {
        field: ProjectSortableField
        order: SortOrder = ASC
    }

    type createProjectResponse{
        OK: Boolean!
        project: Project
        errors: [Error!]
    }

    type Query{
        getProjects(skip: Int, limit: Int, sort: [ProjectSort!], filter: ProjectFilter): [Project!]
        getProject(projectId: ID): Project!
    }
    type Mutation{
        createProject(title: String!, date: Int, titleColor: String, display: Boolean, types: [ID], thumbnail: ID): createProjectResponse!
        deleteProject(projectId: ID!): Boolean!
    }
`;