const { supabase } = require("./supabase.utils.js");
const path = require("path");
const fs = require("fs");

const uploadFileToSupabase = async (file, storagePath) => {
  const fileExt = path.extname(file.name);
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}${fileExt}`;

  // relative path inside bucket
  const fullPath = `${storagePath}/${fileName}`;

  const fileBuffer = fs.readFileSync(file.tempFilePath);

  const { error } = await supabase.storage
    .from("upload") // ✅ bucket name
    .upload(fullPath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype,
    });

  if (error) throw error;

  // Clean up temporary file
  try {
    fs.unlinkSync(file.tempFilePath);
  } catch (cleanupError) {
    console.warn("Failed to clean up temporary file:", cleanupError.message);
  }

  // store only the path, not public URL
  return {
    path: fullPath,
    originalName: file.name,
  };
};

module.exports = { uploadFileToSupabase };
