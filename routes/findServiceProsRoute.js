import express from 'express';
import {
    getProfessionalsByService,
    getProfessionalsByServiceWithHighestRating,
    getProfessionalsDetailsByService,
    getProsAndCompaniesByServiceHighestRating,
    getServicesByNameZip
} from '../controllers/findServiceProsController.js';

const router=express.Router();

router.get('/:serviceId',getProfessionalsByService);
router.get('/details/:professionalId',getProfessionalsDetailsByService);
router.get('/ratings/:serviceId',getProfessionalsByServiceWithHighestRating);
router.get('/ratings/:businessType/:serviceId',getProsAndCompaniesByServiceHighestRating);
router.get('/zip/:serviceId/:zipCode', getServicesByNameZip);



export default router;