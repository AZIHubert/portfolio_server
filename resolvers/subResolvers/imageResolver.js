const Image = require('../../models/Image');
const Work = require('../../models/Work');
const Content = require('../../models/Content');
const User = require('../../models/User');
const cloudinary = require('cloudinary').v2;
const { requiresAuth } = require('../../util/permissions');
const { transformImage } = require('../../util/merge');
const { formatBytes } = require('../../util/normalizers');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_UPLOAD_PRESET
} = require('../../config');

cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

module.exports = {
    Query: {
        async getImages(_, { sort, filter, skip, limit }){
            try{
                const images = await Image.find()
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit)
                    .collation({ locale: "en" });
                return images.map(image => transformImage(image));
            } catch (err) {
                throw new Error(err);
            }
        },
        async getImage(_, {
            imageId
        }){
            try{
                let image = await Image.findById(imageId);
                return transformImage(image);
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createImage: requiresAuth.createResolver(async (_, { upload }, { user: { _id }}) => {
            const errors = [];
            try {
                const { createReadStream } = await upload;
                const fileStream = createReadStream();
                const file = await new Promise((resolve, reject) => {
                    const cloudStream = cloudinary.uploader
                        .upload_stream({
                            upload_preset: CLOUDINARY_UPLOAD_PRESET
                        }, (err, res) => {
                        if (res) resolve(res);
                        else reject(err);
                    });
                    fileStream.pipe(cloudStream);
                });
                const newImage = new Image({
                    filename: file.public_id,
                    url: file.secure_url,
                    size: formatBytes(file.bytes),
                    width: file.width,
                    height: file.height,
                    createdBy: _id
                });
                let image = await newImage.save();
                return {
                    OK: true,
                    errors,
                    image: transformImage(image)
                };
            } catch (err) {
                throw new Error(err);
            }
        }),
        updateImage : requiresAuth.createResolver(async (_, { imageId, ...params }, { user: _id }) =>{
            const errors = [];
            try{
                let {
                    title: oldTitle
                } = await Image.findById(imageId);
                
                if(params.title === undefined || oldTitle === params.title.trim())
                    delete params.title;
                        
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Image has not change.'
                    }]
                };
                const existedImage = await Image.findOne({title: params.title });
                if(existedImage) return {
                    OK: false,
                    errors: [{
                        path: 'title',
                        message: 'title is already taken.'
                    }]
                };
                const updatedImage = await Image.findByIdAndUpdate(imageId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    image: transformImage(updatedImage)
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
        deleteImage: requiresAuth.createResolver(async (_, { imageId }) =>{
            try{
                const { filename, works, contents, users } = await Image.findByIdAndDelete(imageId);
                await cloudinary.uploader.destroy(filename, (err) => {
                    if (err) throw new Error(err);
                });
                if(works.length) await Work.updateMany(
                    { _id: { $in: works } },
                    {  $set: { thumbnail: null } }
                );
                if(contents.length) await Content.updateMany(
                    { _id: { $in: contents } },
                    { $set: { image: null } }
                );
                if(users.length) await User.updateMany(
                    { _id: { $in: users } },
                    { $set: { profilePicture: null } }
                );
                return true;
            } catch (err) {
                throw new Error(err);
            }
        }),
    }
}