import express from 'express';
import { celebrate, Joi, errors, Segments } from 'celebrate';
import { professionalSchema } from '../validators/professionalValidator.js';
import {
	getAllProfessionalsHandler,
	getProfessionalByIdHandler,
	createProfessionalHandler,
	updateProfessionalHandler,
	deleteProfessionalHandler,
} from '../controllers/ProfessionalController.js';
import upload from '../config/multer.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProfessionalsHandler);
router.get('/:id', getProfessionalByIdHandler);
router.post('/', celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', celebrate({ [Segments.BODY]: professionalSchema }), updateProfessionalHandler);
router.delete('/:id', deleteProfessionalHandler);

import { uploadFile } from '../controllers/ProfessionalController.js';
router.post('/upload', upload.single('file'), uploadFile);

export default router;