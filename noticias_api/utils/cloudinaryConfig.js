const cloudinary = require("cloudinary").v2;

// Cloudinary se configura con las variables de entorno del .env
// Estas credenciales las obtienes en: cloudinary.com → Dashboard
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
