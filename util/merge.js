const DataLoader = require('dataloader');

const Block = require('../models/Block');
const Content = require('../models/Content');
const Degree = require('../models/Degree');
const Employment = require('../models/Employment');
const Image = require('../models/Image');
const Part = require('../models/Part');
const Work = require('../models/Work');
const Traineeship = require('../models/Traineeship');
const Type = require('../models/Type');
const User = require('../models/User');
const Workshop = require('../models/Workshop');

// .................................................
// Block 
const transformBlock = block => ({
    ...block._doc,
    _id: block._id,
    part: () => partGetter(block.part),
    contents: () => contentsGetter(block.contents),
    createdBy: () => userGetter(block.createdBy),
    updatedBy: () => userGetter(block.updatedBy)
});
const blocksLoader = new DataLoader(blockIds => blocks(blockIds));
const blocks = async blockIds => {
    try {
        const blocks = await Promise.all(blockIds.map(blockId => Block.findById(blockId)));
        return blocks.map(block => transformBlock(block));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const blockGetter = async function(blockId){
    let block;
    if(blockId) block = await blocksLoader.load(blockId);
    else block = null;
    return block;
};
const blocksGetter = async function(blockIds){
    let blocks;
    if(!!blockIds.length) blocks = await blocksLoader.loadMany(blockIds);
    else blocks = [];
    return blocks;
};

// .................................................
// Content
const transformContent = content => ({
    ...content._doc,
    _id: content._id,
    image: () => imageGetter(content.image),
    createdBy: () => userGetter(content.createdBy),
    updatedBy: () => userGetter(content.updatedBy)
});
const contentsLoader = new DataLoader(contentIds => contents(contentIds));
const contents = async contentIds => {
    try {
        let contents = await Promise.all(contentIds.map(contentId => Content.findById(contentId)));
        return contents.map(content => transformContent(content));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const contentGetter = async function(contentId){
    let content;
    if(contentId) content = await contentsLoader.load(contentId);
    else content = null;
    return content;
};
const contentsGetter = async function(contentIds){
    let contents;
    if(!!contentIds.length) contents = await contentsLoader.loadMany(contentIds);
    else contents = [];
    return contents;
};

// .................................................
// Degree
const transformDegree = degree => ({
    ...degree._doc,
    _id: degree._id,
    createdBy: () => userGetter(degree.createdBy),
    updatedBy: () => userGetter(degree.updatedBy)
});
const degreesLoader = new DataLoader(degreeIds => degrees(degreeIds));
const degrees = async degreeIds => {
    try {
        const degrees = await Promise.all(degreeIds.map(degreeId => Degree.findById(degreeId)));
        return degrees.map(degree => transformDegree(degree));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const degreeGetter = async function(degreeId){
    let degree;
    if(degreeId) degree = await degreesLoader.load(degreeId);
    else degree = null;
    return degree;
};
const degreesGetter = async function(degreeIds){
    let degrees;
    if(!!degreeIds.length) degrees = await degreesLoader.loadMany(degreeIds);
    else degrees = [];
    return degrees;
};

// .................................................
// Employment
const transformEmployment = employment => ({
    ...employment._doc,
    _id: employment._id,
    createdBy: () => userGetter(employment.createdBy),
    updatedBy: () => userGetter(employment.updatedBy)
});
const employmentsLoader = new DataLoader(employmentIds => degrees(employmentIds));
const employments = async employmentIds => {
    try {
        const employments = await Promise.all(employmentIds.map(employmentId => Employment.findById(employmentId)));
        return employments.map(employment => transformEmployment(employment));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const employmentGetter = async function(employmentId){
    let employment;
    if(employmentId) employment = await employmentsLoader.load(employmentId);
    else employment = null;
    return employment;
};
const employmentsGetter = async function(employmentIds){
    let employments;
    if(!!employmentIds.length) employments = await employmentsLoader.loadMany(employmentIds);
    else employments = [];
    return employments;
};

// .................................................
// Employment
const transformGeneral = general => ({
    ...general._doc,
    _id: general._id,
    updatedBy: () => userGetter(general.updatedBy)
});

// .................................................
// Image
const transformImage = image => ({
    ...image._doc,
    _id: image._id,
    createdBy: () => userGetter(image.createdBy),
    works: () => worksGetter(image.works),
    contents: () => contentsGetter(image.contents),
    users: () => usersGetter(image.users)
});
const imagesLoader = new DataLoader(imageIds => images(imageIds));
const images = async imageIds => {
    try {
        const images = await Promise.all(imageIds.map(imageId => Image.findById(imageId)));
        return images.map(image => transformImage(image));
    } catch(err) {
        throw new Error(err);
    }
};
const imageGetter = async function(imageId){
    let image;
    if(imageId) image = await imagesLoader.load(imageId);
    else image = null;
    return image;
};
const imagesGetter = async function(imageIds){
    let images;
    if(!!imageIds.length) images = await imagesLoader.loadMany(imageIds);
    else images = [];
    return images;
};

// .................................................
// Part 
const transformPart = part => ({
    ...part._doc,
    _id: part._id,
    work: () => workGetter(part.work),
    blocks: () => blocksGetter(part.blocks),
    createdBy: () => userGetter(part.createdBy),
    updatedBy: () => userGetter(part.updatedBy)
});
const partsLoader = new DataLoader(partIds => parts(partIds));
const parts = async partIds => {
    try {
        const parts = await Promise.all(partIds.map(partId => Part.findById(partId)));
        return parts.map(part => transformPart(part));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const partGetter = async function(partId){
    let part;
    if(partId) part = await partsLoader.load(partId);
    else part = null;
    return part;
};
const partsGetter = async function(partIds){
    let parts;
    if(!!partIds.length) parts = await partsLoader.loadMany(partIds);
    else parts = [];
    return parts;
};

// .................................................
// Work
const transformWork = work => ({...work._doc,
    _id: work._id,
    thumbnail: () => imageGetter(work.thumbnail),
    parts: () => partsGetter(work.parts),
    createdBy: () => userGetter(work.createdBy),
    updatedBy: () => userGetter(work.updatedBy),
    types: () => typesGetter(work.types)
});
const worksLoader = new DataLoader(workIds => works(workIds));
const works = async workIds => {
    try {
        const works = await Promise.all(workIds.map(workId => Work.findById(workId)));
        return works.map(work => transformWork(work));
    } catch(err) {
        throw new Error(err);
    }
};
const workGetter = async function(workId){
    let work;
    if(workId) work = await worksLoader.load(workId);
    else work = null;
    return work;
};
const worksGetter = async function(workIds){
    let works;
    if(!!workIds.length) works = await worksLoader.loadMany(workIds);
    else works = [];
    return works;
};

// .................................................
// Traineeship 
const transformTraineeship = traineeship => ({
    ...traineeship._doc,
    _id: traineeship._id,
    createdBy: () => userGetter(traineeship.createdBy),
    updatedBy: () => userGetter(traineeship.updatedBy)
});
const traineeshipsLoader = new DataLoader(traineeshipIds => traineeships(traineeshipIds));
const traineeships = async traineeshipIds => {
    try {
        const traineeships = await Promise.all(traineeshipIds.map(traineeshipId => Traineeship.findById(traineeshipId)));
        return traineeships.map(traineeship => transformTraineeship(traineeship));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const traineeshipGetter = async function(traineeshipId){
    let traineeship;
    if(traineeshipId) traineeship = await traineeshipsLoader.load(traineeshipId);
    else traineeship = null;
    return traineeship;
};
const traineeshipsGetter = async function(traineeshipIds){
    let traineeships;
    if(!!traineeshipIds.length) traineeships = await traineeshipsLoader.loadMany(traineeshipIds);
    else traineeships = [];
    return traineeships;
};

// .................................................
// Type 
const transformType = type => ({
    ...type._doc,
    _id: type._id,
    createdBy: () => userGetter(type.createdBy),
    updatedBy: () => userGetter(type.updatedBy),
    works: () => worksGetter(type.works)
});
const typesLoader = new DataLoader(typeIds => types(typeIds));
const types = async typeIds => {
    try {
        const types = await Promise.all(typeIds.map(typeId => Type.findById(typeId)));
        return types.map(type => transformType(type));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const typeGetter = async function(typeId){
    let type;
    if(typeId) type = await typesLoader.load(typeId);
    else type = null;
    return type;
};
const typesGetter = async function(typeIds){
    let types;
    if(!!typeIds.length) types = await typesLoader.loadMany(typeIds);
    else types = [];
    return types;
};

// .................................................
// User 
const transformUser = user => ({
    ...user._doc,
    id: user._id,
    profilePicture: () => imageGetter(user.profilePicture)
});
const usersLoader = new DataLoader(userIds => users(userIds));
const users = async userIds => {
    try {
        const users = await Promise.all(userIds.map(userId => User.findById(userId)));
        return users.map(user => transformUser(user));
    } catch(err) {
        throw new Error(err);
    }
};
const userGetter = async function(userId){
    let user;
    if(userId) user = await usersLoader.load(userId);
    else user = null;
    return user;
};
const usersGetter = async function(userIds){
    let users;
    if(!!userIds.length) users = await usersLoader.loadMany(userIds);
    else users = [];
    return users;
};

// .................................................
// Workshop
const transformWorkshop = workshop => ({
    ...workshop._doc,
    _id: workshop._id,
    createdBy: () => userGetter(workshop.createdBy),
    updatedBy: () => userGetter(workshop.updatedBy)
});
const workshopsLoader = new DataLoader(workshopIds => degrees(workshopIds));
const workshops = async workshopIds => {
    try {
        const workshops = await Promise.all(workshopIds.map(workshopId => Workshop.findById(workshopId)));
        return workshops.map(workshop => transformWorkshop(workshop));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};
const workshopGetter = async function(workshopId){
    let workshop;
    if(workshopId) workshop = await workshopsLoader.load(workshopId);
    else workshop = null;
    return workshop;
};
const workshopsGetter = async function(workshopIds){
    let workshops;
    if(!!workshopIds.length) workshops = await workshopsLoader.loadMany(workshopIds);
    else workshops = [];
    return workshops;
};


module.exports.transformBlock = transformBlock;
module.exports.transformContent = transformContent;
module.exports.transformDegree = transformDegree;
module.exports.transformEmployment = transformEmployment;
module.exports.transformGeneral = transformGeneral;
module.exports.transformImage = transformImage;
module.exports.transformPart = transformPart;
module.exports.transformWork = transformWork;
module.exports.transformTraineeship = transformTraineeship;
module.exports.transformType = transformType;
module.exports.transformUser = transformUser;
module.exports.transformWorkshop = transformWorkshop;