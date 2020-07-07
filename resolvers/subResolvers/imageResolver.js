const Image = require('../../models/Image');
const Project = require('../../models/Project');
const cloudinary = require('cloudinary').v2;
const { requiresAuth } = require('../../util/permissions');
const { transformImage } = require('../../util/merge');

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
        async getImages(){
            try{
                const images = await Image.find();
                return images.map(image => transformImage(image));
            } catch(err) {
                throw new Error(err);
            }
        },
        async getImage(_, {
            imageId
        }){
            try{
                let image = await Image.findById(imageId);
                return transformImage(image);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        uploadImage: requiresAuth.createResolver(async (_, { upload }, { user: { _id }}) => {
            try {
                const { createReadStream } = await upload;
                const fileStream = createReadStream();
                const file = await new Promise((resolve, reject) => {
                    const cloudStream = cloudinary.uploader
                        .upload_stream({
                            upload_preset: CLOUDINARY_UPLOAD_PRESET
                        }, (err, res) => {
                        if(res) {
                            console.log(res)
                            resolve(res)
                        } else {
                            console.log(err)
                            reject(err);
                        }
                    });
                    fileStream.pipe(cloudStream);
                });
                const newImage = new Image({
                    filename: file.public_id,
                    url: file.url,
                    createdBy: _id
                });
                let image = await newImage.save();
                return transformImage(image);
            } catch(err) {
                throw new Error(err);
            }
        }),
        deleteImage: requiresAuth.createResolver(async (_, { imageId }) =>{
            try{
                const { filename, projects } = await Image.findByIdAndDelete(imageId);
                await cloudinary.uploader.destroy(filename,(err, res) => {
                    if(res) console.log(res);
                    if(err) throw new Error(err);
                });
                if(projects.length) await Project.updateMany(
                    { _id: { $in: projects } },
                    {  $set: { thumbnail: null } }
                );
                return true;
            } catch(err) {
                throw new Error(err);
            }
        }),
    }
}