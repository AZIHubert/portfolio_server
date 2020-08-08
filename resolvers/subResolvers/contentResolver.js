const Content = require('../../models/Content');
const Block = require('../../models/Block');
const Image = require('../../models/Image');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformContent } = require('../../util/merge');

module.exports = {
    Query: {
        async getContents(_, { sort, filter, skip, limit }) {
            try {
                let contents = await Content
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
                return contents.map(content => transformContent(content));
            } catch (err) {
                throw new Error(err);
            }
        },
        async getContent(_, { contentId }){
            try {
                let content = await Content.findById(contentId);
                return transformContent(content);
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createContent: requiresAuth.createResolver(async (_, { blockId, image: imageId, ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const contents = await Content.find({ block: blockId });
                if(params.type === 'text' && (params.body.trim() === '' || params.body === undefined)){
                    return {
                        OK: false,
                        errors: [{
                            path: 'body',
                            message: 'Body Can\'t be empty'
                        }]
                    }
                }
                if(params.type === 'image' && (!imageId || imageId === undefined)){
                    return {
                        OK: false,
                        errors: [{
                            path: 'image',
                            message: 'Image Can\'t be empty'
                        }]
                    }
                }
                const newContent = new Content({
                    block: blockId,
                    ...params,
                    image: imageId ? imageId : null,
                    index: contents.length,
                    createdBy: _id
                });
                if(imageId){
                    const image = await Image.findById(imageId);
                    image.contents.push(newContent._id);
                    await image.save();
                }
                const savedContent = await newContent.save();
                await Block.findByIdAndUpdate(blockId, { $push: { contents: savedContent._id } });
                return {
                    OK: true,
                    errors,
                    content: transformContent(savedContent)
                };
            } catch (err) {
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
        updateContent: requiresAuth.createResolver(async (_, {
            contentId, ...params
        }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    paddingTop: oldPaddingTop,
                    type: oldType,
                    image: oldImage,
                    color: oldColor,
                    variant: oldVariant,
                    textAlign: oldTextAlign,
                    body: oldBody
                } = await Content.findById(contentId);
                
                
                if(params.type === 'text'){
                    delete params.image;
                    if(params.color === undefined || oldColor === params.color)
                        delete params.color;
                    if(params.variant === undefined || oldVariant === params.variant)
                        delete params.variant;
                    if(params.textAlign === undefined || oldTextAlign === params.textAlign)
                        delete params.textAlign;
                    if(params.body === undefined || oldBody === params.body.trim())
                        delete params.body;
                }
                if(params.type === 'image'){
                    delete params.color;
                    delete params.variant;
                    delete params.textAlign;
                    delete params.body;
                    if(oldImage === params.image)
                        delete params.oldImage;
                }
                if(params.paddingTop === undefined || oldPaddingTop === params.paddingTop)
                    delete params.paddingTop;
                if(params.type === undefined || oldType === params.type)
                    delete params.type;
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Content has not change.'
                    }]
                };
                const type = params.type || oldType;
                let updatedContent;
                if(type === 'text'){
                    updatedContent = await Content.findByIdAndUpdate(contentId,
                        { ...params, image: null, updatedBy: _id },
                        { new: true }   
                    )
                }
                if(type === 'image'){
                    updatedContent = await Content.findByIdAndUpdate(contentId,
                        {
                            ...params,
                            color: '#1e0a14',
                            variant: 'body1',
                            textAlign: 'left',
                            body: '',
                            updatedBy: _id
                        },
                        { new: true }   
                    )
                }
                if("image" in params){
                    await Image.findOneAndUpdate(
                        { _id: oldImage },
                        { $pull: { contents: contentId } }
                    );
                    await Image.findOneAndUpdate(
                        { _id: params.image },
                        { $push: { contents: contentId } }
                    );
                }
                return {
                    OK: true,
                    errors,
                    content: transformContent(updatedContent)
                };
            } catch (err) {
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
        moveContent: requiresAuth.createResolver(async (_, { contentId,  index}) => {
            try {
                let content = await Content.findById(contentId);
                const contents = await Content.find({ block: content.block });

                if(index < 0 || index > contents.length - 1) return { OK: false, errors: [{ path: 'general', message: 'Index' }] };

                let oldIndex = content.index;
                content.index = index;

                await Content.updateMany({
                    $and: [
                        {_id: {$ne: contentId}},
                        {block: content.block},
                        {index: {$gte: oldIndex}}
                    ]
                }, {
                    $inc: {index: -1}
                });
                await Content.updateMany({
                    $and: [
                        {_id: {$ne: contentId}},
                        {block: content.block},
                        {index: {$gte: index}}
                    ]
                }, {
                    $inc: {index: 1}
                });
                await content.save();

                let editedContents = await Content.find({ block: content.block }).sort({index: 1});
                editedContents = editedContents.map(content => transformContent(content));
                return { OK: true, errors: [], contents: editedContents };
            } catch (err) {
                throw new Error(err);
            }
        }),
        deleteContent: requiresAuth.createResolver(async (_, { contentId }) => {
            try{
                const { block, image, index } = await Content.findByIdAndDelete(contentId);
                await Content.updateMany(
                    { $and: [
                        { index: { $gte: index } },
                        { block: { $eq: block } }
                    ] },
                    { $inc: { index: -1 } }
                );
                if(image) {
                    await Image.findOneAndUpdate(
                        { _id: image },
                        { $pull: { contents: contentId } }
                    );
                }
                if(block) await Block.findOneAndUpdate(
                    { _id: block },
                    { $pull: { contents: contentId } }
                );
                return true;
            } catch (err) {
                throw new Error(err);
            }
        })
    }
}