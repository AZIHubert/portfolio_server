const DataLoader = require('dataloader');
const Project = require('../../../models/Project');
const { userGetter } = require('./userGetter');
const { imageGetter } = require('./imageGetter');
const { partsGetter } = require('./partGetter');

const transformProject = project => ({
    ...project._doc,
    _id: project._id,
    thumbnail: () => imageGetter(project.thumbnail),
    parts: () => partsGetter(project.parts),
    createdBy: () => userGetter(content.createdBy),
    editedBy: () => userGetter(content.editedBy)
});

const projectLoader = new DataLoader(projectId => project(projectId));
const project = async projectId => {
    try {
        const project = await Project.findById(projectId);
        return transformProject(project);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const projectsLoader = new DataLoader(projectIds => projects(projectIds));
const projects = async projectIds => {
    try {
        const projects = await Promise.all(projectIds.map(projectId => Project.findById(projectId)));
        return projects.map(project => transformProject(project));
    } catch(err) {
        throw new Error(err);
    }
};

module.exports.transformProject = transformProject;
module.exports.projectGetter = async function(projectId){
    let project;
    if(projectId) project = await projectLoader.load(projectId);
    else project = null;
    return project;
};
module.exports.projectsGetter = async function(projectIds){
    let projects;
    if(!!projectIds.length) projects = await projectsLoader.loadMany(projectIds);
    else projects = [];
    return projects;
};