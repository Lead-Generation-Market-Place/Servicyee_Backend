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
router.get('/', getAllProfessionalsHandler);
router.get('/:id', getProfessionalByIdHandler);
router.post('/', createProfessionalHandler);
router.put('/:id', updateProfessionalHandler);
router.delete('/:id', deleteProfessionalHandler);

export default router;