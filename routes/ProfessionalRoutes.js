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
} from '../controllers/ProfessionalController.js';
import upload from '../config/multer.js';
import { authenticateJWT } from '../middleware/auth.js';
import { uploadFile } from '../controllers/ProfessionalController.js';
import { UpdateprofessionalSchema } from '../validators/updatePorfessionaIntro.js';

const router = express.Router();

router.get('/', getAllProfessionalsHandler);
router.get('/pro', authenticateJWT, getProfessionalByUserIdHandler);
router.post('/', celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  updateProfessionalIntroductionById);
router.put('/:id/introduction', upload.single('profile_image'), celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  updateProfessionalInfo);

router.delete('/:id', deleteProfessionalHandler);


router.post('/upload', upload.single('file'), uploadFile);

export default router;