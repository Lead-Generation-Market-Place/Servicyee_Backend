import express from 'express';
import { celebrate, Joi, errors, Segments } from 'celebrate';
import { professionalSchema } from '../validators/professionalValidator.js';
import {
	getAllProfessionalsHandler,
	createProfessionalHandler,
	deleteProfessionalHandler,
	getProfessionalByUserIdHandler,
	updateProfessionalIntroductionById,
	updateProfessionalInfo,
	uploadFile
} from '../controllers/ProfessionalController.js';
import createUploader from '../config/multer.js';  // rename to reflect it's a factory function
import { authenticateJWT } from '../middleware/auth.js';
import { UpdateprofessionalSchema } from '../validators/updatePorfessionaIntro.js';

const router = express.Router();

// Create a multer instance for your uploads folder (change folder name as needed)
const upload = createUploader('profile_images'); 

router.get('/', getAllProfessionalsHandler);
router.get('/pro', authenticateJWT, getProfessionalByUserIdHandler);
router.post('/', celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', celebrate({ [Segments.BODY]: UpdateprofessionalSchema }), updateProfessionalIntroductionById);

// Use multer's .single() on the actual multer instance created above
router.put('/:id/introduction', 
	upload.single('profile_image'), 
	celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  
	updateProfessionalInfo
);

router.delete('/:id', deleteProfessionalHandler);

router.post('/upload', upload.single('file'), uploadFile);

export default router;
