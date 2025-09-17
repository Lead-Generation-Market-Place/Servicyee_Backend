import multer from "multer";
import path from "path";

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const OriginalName = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + Date.now() + OriginalName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images/videos are allowed'), false);
  }
};
const upload = multer({ storage: Storage, fileFilter });
export default upload;
