const DataLoader = require('dataloader');
const Content = require('../../../models/Content');
const { imageGetter } = require('./imageGetter');
const { userGetter } = require('./userGetter');

const transformContent = content => ({
    ...content._doc,
    _id: content._id,
    image: () => imageGetter(content.image),
    createdBy: () => userGetter(content.createdBy),
    editedBy: () => userGetter(content.editedBy)
});

const contentLoader = new DataLoader(contentId => content(contentId));
const content = async contentId => {
    try {
        const content = await Image.findById(contentId);
        return transformContent(content);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

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

module.exports.transformContent = transformContent;
module.exports.contentGetter = async function(contentId){
    let content;
    if(contentId) content = await contentLoader.load(contentId);
    else content = null;
    return content;
};
module.exports.contentsGetter = async function(contentIds){
    let contents;
    if(!!contentIds.length) contents = await contentsLoader.loadMany(contentIds);
    else contents = [];
    return contents;
};