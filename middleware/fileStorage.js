import multer from "multer";
import path from "path";
import fs from "fs";

export const configureFileUpload = (isSingle = false, fieldName = "") => {
  // Ensure 'uploads' directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  // Configure multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname); // Extract file extension
      cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Generate unique filename
    },
  });

  // Define allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/csv",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "video/mp4",
    "video/avi",
    "video/mpeg",
  ];

  // Configure multer instance with file validation
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      console.log(file.mimetype);
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Unsupported file type"), false);
      }
    },
  });

  // Return appropriate middleware based on upload type (single or multiple)
  if (isSingle) {
    if (!fieldName) {
      throw new Error("Field name must be provided for single file upload.");
    }
    return upload.single(fieldName); // Middleware for single file upload
  } else {
    // Define fields for multiple files
    return upload.fields([
      { name: "zelleQrCode", maxCount: 1 },
      { name: "paypalQrCode", maxCount: 1 },
      { name: "csvFile", maxCount: 1 },
      { name: "audioFile", maxCount: 1 },
      { name: "videoFile", maxCount: 1 },
      { name: "media", maxCount: 1}
    ]);
  }
};
