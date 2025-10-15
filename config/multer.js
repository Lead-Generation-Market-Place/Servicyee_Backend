import multer from "multer";
import path from "path";
import fs from "fs";

const fileFilter = (req, file, cb) => {
  console.log('Processing file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(fileExt)) {
    console.log(`✓ File allowed by extension: ${fileExt}`);
    cb(null, true);
  } else {
    console.log(`✗ File rejected. Extension: ${fileExt}, MIME: ${file.mimetype}`);
    cb(new Error(`Only image files are allowed (${allowedExts.join(', ')}). Received: ${file.originalname}`), false);
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
    cb(null, `${folderName}_${timestamp}${ext}`);
  }
});

const createUploader = (folderName) => {
  return multer({
    storage: getStorage(folderName),
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    }
  });
};

export default createUploader;