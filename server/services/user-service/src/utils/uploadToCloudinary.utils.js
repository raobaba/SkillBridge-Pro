const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (make sure you load env vars properly)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Temp file path from req.files
 * @param {string} folder - Cloudinary folder name
 * @param {object} options - Extra upload options (resize, crop, etc.)
 * @returns {Promise<object>} - Returns uploaded file details
 */
const uploadToCloudinary = async (
  filePath,
  folder = "general",
  options = {}
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      ...options,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

module.exports = { uploadToCloudinary };
