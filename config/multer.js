import multer from "multer";
import path from "path";
import fs from "fs";

const fileFilter = (req, file, cb) => {
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".avi"];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image/video files are allowed. Received: ${file.originalname}`), false);
  }
};



const getStorage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${folderName}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now(); // Unique timestamp
    
    // Create filename: folderName_timestamp.extension
    cb(null, `${timestamp}${ext}`);
  }
});

const createUploader = (folderName) => {
  return multer({
    storage: getStorage(folderName),
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 10MB
    }
  });
};

export default createUploader;