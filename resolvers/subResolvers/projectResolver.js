const Project = require('../../models/Project');
const Image = require('../../models/Image');
const { transformProject } = require('../../util/merge');

module.exports = {
    Query: {
        async getProjects() {
            try {
                let projects = await Project.find();
                return projects.map(project => transformProject(project));
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
        createProject: async (_, { thumbnail, ...params }, context) => {
            const errors = [];
            try {
                const newProject = new Project({thumbnail, ...params});
                await Project.updateMany({
                    $inc: {index: 1}
                });
                const savedProject = await newProject.save();
                if(thumbnail){
                    const image = await Image.findById(thumbnail);
                    console.log('image', image);
                    image.projects.push(savedProject._id);
                    await image.save();
                }
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