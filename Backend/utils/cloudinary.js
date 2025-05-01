const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dojmis2jl',
  api_key: '533359989613388',
  api_secret: 'DYzKgHojol7uh1IJgUMy5R2n0G0'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tournaments', // optional folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
  },
});

module.exports = { cloudinary, storage };
