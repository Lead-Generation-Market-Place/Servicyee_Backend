import express from 'express';
import {
    getProfessionalsByService,
    getProfessionalsByServiceWithHighestRating,
    getProfessionalsDetailsByService
} from '../controllers/findServiceProsController.js';

const router=express.Router();

router.get('/:serviceId',getProfessionalsByService);
router.get('/details/:professionalId',getProfessionalsDetailsByService);
router.get('/ratings/:serviceId',getProfessionalsByServiceWithHighestRating);
export default router;