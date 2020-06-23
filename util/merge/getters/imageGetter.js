const DataLoader = require('dataloader');
const Image = require('../../../models/Image');
const { userGetter } = require('./userGetter');
const { contentsGetter } = require('./contentGetter');
const { projectsGetter } = require('./projectGetter');

const transformImage = image => ({
    ...image._doc,
    _id: image._id,
    uploadBy: () => userGetter(image.createdBy),
    projects: () => projectsGetter(image.projects),
    contents: () => contentsGetter(image.contents),
    user: () => userGetter(image.user)
});

const imageLoader = new DataLoader(imageId => image(imageId));
const image = async imageId => {
    try {
        const image = await Image.findById(imageId);
        return transformImage(image);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const imagesLoader = new DataLoader(imageIds => images(imageIds));
const images = async imageIds => {
    try {
        const images = await Promise.all(imageIds.map(imageId => Image.findById(imageId)));
        return images.map(image => transformImage(image));
    } catch(err) {
        throw new Error(err);
    }
};

module.exports.transformImage = transformImage;
module.exports.imageGetter = async function(imageId){
    let image;
    if(imageId) image = await imageLoader.load(imageId);
    else image = null;
    return image;
};
module.exports.imagesGetter = async function(imageIds){
    let images;
    if(!!imageIds.length) images = await imagesLoader.loadMany(imageIds);
    else images = [];
    return images;
};