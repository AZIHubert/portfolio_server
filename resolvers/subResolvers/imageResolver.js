const Image = require('../../models/Image');
const cloudinary = require('cloudinary').v2;
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
        async uploadImage(_, { upload }, context){
            try {
                const { createReadStream } = await upload;
                const fileStream = createReadStream();
                const file = await new Promise((resolve, reject) => {
                    const cloudStream = cloudinary.uploader
                        .upload_stream({
                            upload_preset: CLOUDINARY_UPLOAD_PRESET
                        }, (err, res) => {
                        if(res) {
                            resolve(res)
                        } else {
                            reject(err);
                        }
                    });
                    fileStream.pipe(cloudStream);
                });
                const newImage = new Image({
                    filename: file.public_id,
                    url: file.url
                });
                let image = await newImage.save();
                return transformImage(image);
            } catch(err) {
                throw new Error(err);
            }
        },
        async deleteImage(_, {
            imageId
        }, contex){
            checkAuth(contex);
            try{
                if (!imageId.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Invalid ObjectId');
                const image = await Image.findById(imageId);
                if(!image) throw new Error('Image not found');
                const oldImageId = image._id;
                await cloudinary.uploader.destroy(image.filename,  {
                    type: "authenticated"
                },(err, res) => {
                    if(err) throw new Error(err);
                });
                await image.delete();
                await Project.updateMany({
                    thumbnail: {$eq: oldImageId}
                }, {
                    thumbnail: null
                });
                return 'Image deleted successfully';
            } catch(err) {
                throw new Error(err);
            }
        }
    }
}