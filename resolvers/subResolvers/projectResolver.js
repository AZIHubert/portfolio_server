const Project = require('../../models/Project');
const { transformProject } = require('../../util/merge');

module.exports = {
    Query: {
        async getProjects() {
            try {
                let projects = await Project.find();
                return projects.map(uprojectser => transformProject(project));
            } catch (err) {
                console.log(err);
            }
        },
        async getProject(_, { projectId }){
            try {
                let project = await Project.findById(projectId);
                return transformProject(project);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createProject: async (_, { ...params }, context) => {
            const errors = [];
            try {
                const newProject = new Project({...params});
                console.log(newProject)
                await Project.updateMany({
                    $inc: {index: 1}
                });
                const savedProject = await newProject.save();
                return {
                    OK: true,
                    errors,
                    project: transformProject(savedProject)
                };
            } catch(err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        },
        // async editeProject() {

        // },
        // async deleteProject() {

        // }
    }
}