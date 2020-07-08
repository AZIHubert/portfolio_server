const Project = require('../../models/Project');
const Image = require('../../models/Image');
const Type = require('../../models/Type');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformProject } = require('../../util/merge');

module.exports = {
    Query: {
        async getProjects(_, { sort, filter, skip, limit }) {
            try {
                let projects = await Project
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
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
        createProject: requiresAuth.createResolver(async (_, { types, thumbnail, ...params }, { user: { _id }}) => {
            const errors = [];
            try {
                const newProject = new Project({
                    types,
                    thumbnail,
                    ...params,
                    parts: [],
                    createdBy: _id
                });
                const savedProject = await newProject.save();
                await Project.updateMany({
                    $inc: {index: 1}
                });
                if(thumbnail){
                    const image = await Image.findById(thumbnail);
                    image.projects.push(savedProject._id);
                    await image.save();
                }
                if(types.length){
                    const saveTypes = await Promise.all(types.map(typeId => Type.findById(typeId)));
                    saveTypes.forEach(type => {
                        type.projects.push(savedProject._id);
                    });
                    await Promise.all(saveTypes.map(type => type.save()));
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
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        // async editeProject() {

        // },
        deleteProject: async (_, { projectId }) => {
            try{
                const { thumbnail, types, index } = await Project.findByIdAndDelete(projectId);
                await Project.updateMany(
                    { index: { $gte: index } },
                    { $inc: { index: -1 } }
                );
                if(thumbnail) {
                    await Image.findOneAndUpdate(
                        { _id: thumbnail },
                        { $pull: { projects: projectId } }
                    );
                }
                if(types.length){
                    await Type.updateMany(
                        { _id: { $in: types } },
                        {  $pull: { projects: projectId } }
                    );
                }
                return true
            } catch(err) {
                console.log(err);
                return false;
            }
        }
    }
}