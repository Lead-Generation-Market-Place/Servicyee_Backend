import express from 'express';
import {
    getProfessionalsByService,
    getProfessionalsDetailsByService
} from '../controllers/findServiceProsController.js';

const router=express.Router();

router.get('/:serviceId',getProfessionalsByService);
router.get('/details/:professionalId',getProfessionalsDetailsByService);
export default router;