import express from 'express';
import {
	getAllProfessionalsHandler,
	getProfessionalByIdHandler,
	createProfessionalHandler,
	updateProfessionalHandler,
	deleteProfessionalHandler,
} from '../controllers/ProfessionalController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Get all professionals
router.get('/', getAllProfessionalsHandler);
router.get('/:id', getProfessionalByIdHandler);
router.post('/', createProfessionalHandler);
router.put('/:id', updateProfessionalHandler);
router.delete('/:id', deleteProfessionalHandler);

// File upload route (example: profile image, certificate, etc.)
// Controller method 'uploadFile' should be implemented in ProfessionalController.js
import { uploadFile } from '../controllers/ProfessionalController.js';
router.post('/upload', upload.single('file'), uploadFile);

export default router;