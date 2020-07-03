module.exports = `
    type Project{
        _id: ID!
        index: Int!
        title: String!
        titleColor: String!
        date: Int!
        types: [Type]
        display: Boolean!
        thumbnail: Image
        parts: [Part]
        createdAt: String!
        createdBy: User!
        updatedAt: String
        updatedBy: User
    }
    type createProjectResponse{
        OK: Boolean!
        project: Project
        errors: [Error!]
    }
    type Query{
        getProjects: [Project!]
        getProject(projectId: ID): Project!
    }
    type Mutation{
        createProject(title: String!, date: Int, titleColor: String, display: Boolean, typeIds: [ID], thumbnail: Upload): createProjectResponse!
    }
`;