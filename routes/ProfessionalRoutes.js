import express from 'express';
import {
	getAllProfessionalsHandler,
	getProfessionalByIdHandler,
	createProfessionalHandler,
	updateProfessionalHandler,
	deleteProfessionalHandler
} from '../controllers/ProfessionalController.js';

const router = express.Router();

// Get all professionals
router.get('/professionals', getAllProfessionalsHandler);
router.get('/professionals/:id', getProfessionalByIdHandler);
router.post('/', createProfessionalHandler);
router.put('/professionals/:id', updateProfessionalHandler);
router.delete('/professionals/:id', deleteProfessionalHandler);

export default router;