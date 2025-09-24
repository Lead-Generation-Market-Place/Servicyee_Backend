import express from 'express';
import {
    getProfessionalsByService
} from '../controllers/findServiceProsController.js';

const router=express.Router();

router.get('/:serviceId',getProfessionalsByService);
export default router;