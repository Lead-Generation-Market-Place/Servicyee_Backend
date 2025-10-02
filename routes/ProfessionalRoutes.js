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
const upload = createUploader('profile_images'); 
router.get('/', getAllProfessionalsHandler);
router.get('/pro', authenticateJWT, getProfessionalByUserIdHandler);
router.post('/', celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', celebrate({ [Segments.BODY]: UpdateprofessionalSchema }), updateProfessionalIntroductionById);
router.put('/:id/introduction', 
	upload.single('profile_image'), 
	celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  
	updateProfessionalInfo
);

router.delete('/:id', deleteProfessionalHandler);


export default router;
