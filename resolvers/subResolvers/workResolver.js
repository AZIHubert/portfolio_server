const Work = require('../../models/Work');
const Image = require('../../models/Image');
const Type = require('../../models/Type');
const Part = require('../../models/Part');
const Block = require('../../models/Block');
const Content = require('../../models/Content');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformWork } = require('../../util/merge');

module.exports = {
    Query: {
        async getWorks(_, { sort, filter, skip, limit }) {
            try {
                let works = await Work
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
                return works.map(work => transformWork(work));
            } catch (err) {
                console.log(err);
            }
        },
        async getWork(_, { workId }){
            try {
                let work = await Work.findById(workId);
                return transformWork(work);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createWork: requiresAuth.createResolver(async (_, { types, thumbnail, ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const newWork = new Work({
                    types,
                    thumbnail,
                    ...params,
                    parts: [],
                    createdBy: _id
                });
                const savedWork = await newWork.save();
                await Work.updateMany(
                    { _id: { $ne: savedWork._id } },
                    { $inc: { index: 1 } }
                );
                if(thumbnail){
                    const image = await Image.findById(thumbnail);
                    image.works.push(savedWork._id);
                    await image.save();
                }
                if(types.length){
                    const saveTypes = await Promise.all(types.map(typeId => Type.findById(typeId)));
                    saveTypes.forEach(type => {
                        type.works.push(savedWork._id);
                    });
                    await Promise.all(saveTypes.map(type => type.save()));
                }
                return {
                    OK: true,
                    errors,
                    work: transformWork(savedWork)
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
        updateWork: requiresAuth.createResolver(async (_, {
            workId, ...params
        }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    types: oldTypes,
                    title: oldTitle,
                    date: oldDate,
                    titleColor: oldTitleColor,
                    display: oldDisplay,
                    thumbnail: oldThumbnail
                } = await Work.findById(workId);
                oldTypes = oldTypes.map(type => type.toString());
                oldThumbnail = oldThumbnail ? oldThumbnail.toString() : null;

                if(oldTitle === params.title)
                    delete params.title;
                if(params.types === undefined || oldTypes.sort().join(',') === params.types.sort().join(','))
                    delete params.types;
                if(oldThumbnail === params.thumbnail)
                    delete params.thumbnail;
                if(params.date === undefined || oldDate === params.date)
                    delete params.date;
                if(params.titleColor === undefined || oldTitleColor === params.titleColor)
                    delete params.titleColor;
                if(params.display === undefined || oldDisplay === params.display)
                    delete params.display;

                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Work has not change.'
                    }]
                };
                const existedTitle = await Work.findOne({ title: params.title });
                if(existedTitle) return {
                    OK: false,
                    errors: [{
                        path: 'title',
                        message: 'Title already exist.'
                    }]
                };
                const updatedWork = await Work.findByIdAndUpdate(workId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                if("types" in params){
                    const removeTypes = oldTypes.filter(type => !params.types.includes(type));
                    const newTypes = params.types.filter(type => !oldTypes.includes(type));
                    if(removeTypes.length) await Type.updateMany(
                        { _id: { $in: removeTypes } },
                        {  $pull: { works: workId } }
                    );
                    if(newTypes.length) await Type.updateMany(
                        { _id: { $in: newTypes } },
                        {  $push: { works: workId } }
                    );
                }
                if("thumbnail" in params){
                    await Image.findOneAndUpdate(
                        { _id: oldThumbnail },
                        { $pull: { works: workId } }
                    );
                    await Image.findOneAndUpdate(
                        { _id: params.thumbnail },
                        { $push: { works: workId } }
                    );
                }
                return {
                    OK: true,
                    errors,
                    work: transformWork(updatedWork)
                };
            } catch (err) {
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
        moveWork: requiresAuth.createResolver(async (_, { workId, index}) => {
            console.log('start moving');
            try {
                const works = await Work.find();
                let work = await Work.findById(workId);
                if(index < 0 || index > works.length - 1)
                    throw new Error('Index out of range');
                let oldIndex = work.index;
                work.index = index;
                await Work.updateMany({
                    $and: [
                        {_id: {$ne: workId}},
                        {index: {$gte: oldIndex}}
                    ]
                }, {
                    $inc: {index: -1}
                });
                await Work.updateMany({
                    $and: [
                        {_id: {$ne: workId}},
                        {index: {$gte: index}}
                    ]
                }, {
                    $inc: {index: 1}
                });
                await work.save();
                let editedWorks = await Work.find().sort({index: 1});
                editedWorks = editedWorks.map(work => transformWork(work));
                return editedWorks;
            } catch(err) {
                console.log(err);
                throw new Error(err);
            }
        }),
        deleteWork: requiresAuth.createResolver(async (_, { workId }) => {
            try{
                const { thumbnail, types, index, parts } = await Work.findByIdAndDelete(workId);
                await Work.updateMany(
                    { index: { $gte: index } },
                    { $inc: { index: -1 } }
                );
                if(thumbnail) {
                    await Image.findOneAndUpdate(
                        { _id: thumbnail },
                        { $pull: { works: workId } }
                    );
                }
                if(types.length){
                    await Type.updateMany(
                        { _id: { $in: types } },
                        {  $pull: { works: workId } }
                    );
                }
                if(parts.length) {
                    const blocks = Part.find({  _id: { $in: parts } })
                        .map(part => part.blocks)
                        .reduce((prev, curr) => prev.concat(curr));
                    Part.deleteMany({  _id: { $in: parts } });
                    if(blocks.length) {
                        const contents = Block.find({  _id: { $in: blocks } })
                            .map(block => block.contents)
                            .reduce((prev, curr) => prev.concat(curr));
                        Block.deleteMany({  _id: { $in: blocks } });
                        if(contents.length) Content.deleteMany({ _id: { $in: contents }});
                    }
                }
                return true
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}