import multer from "multer";
import path from "path";
import fs from "fs";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images/videos are allowed'), false);
  }
};

const getStorage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${folderName}`;
    fs.mkdirSync(dir, { recursive: true }); // Create folder if not exists
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + Date.now() + ext);
  }
});

const createUploader = (folderName) => {
  return multer({
    storage: getStorage(folderName),
    fileFilter,
  });
};

export default createUploader;
