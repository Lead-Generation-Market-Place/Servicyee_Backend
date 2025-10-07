import { Router } from "express";
import { createReviewsHandler } from "../controllers/ReviewController.js";
import { createReviewSchema } from "../validators/Reviews.js";
import createUploader from "../config/multer.js";
import { celebrate, Segments } from "celebrate";


const router = Router()
const upload = createUploader('professionals'); 
router.post('/', upload.single('file'),  celebrate({ [Segments.BODY]: createReviewSchema }), createReviewsHandler)

export default router;
