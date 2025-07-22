const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: 'dcpo3rhzf',       // ✅ wrapped in quotes
  api_key: '481352159213184',    // ✅ wrapped in quotes
  api_secret: 'jf_N7gNePY_SL78G8HujlrGMnFg', // ✅ wrapped in quotes
});

module.exports = cloudinary;
