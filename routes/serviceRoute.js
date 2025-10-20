import express from 'express';
import {
  getServices,
  addServices,
  updateService,
  deleteService,
  getServiceById,

  getServicesOFAuthenticatedUser,
  assignServiceToProfessional,
  getProfessionalCount
  , toggleServiceStatus,
  featuredServicesHandler,fetchAllServicesOfAProfessional,
  updateProfessionalService
} from '../controllers/serviceController.js';


import  fileupload  from "../config/multer.js";
import { uploadFile } from '../controllers/ProfessionalController.js';

const router = express.Router();

// ✅ Static/specific routes first
router.get('/location', getProfessionalCount); // Needs to come before /:id
router.put('/toggle-service-status', toggleServiceStatus);
router.get('/auth/:id', getServicesOFAuthenticatedUser);
router.get('/pro/:id', fetchAllServicesOfAProfessional);
router.post('/asp', assignServiceToProfessional);

// ✅ General routes
router.get('/', getServices);
router.post('/', fileupload('service').single('image_url'),
 addServices);
 //featured services
router.get('/featured', featuredServicesHandler);

// ✅ Dynamic route must be LAST
router.get('/:id', getServiceById);
router.put('/:id', fileupload('service').single('image_url'), updateService);
// Use this pattern: /professional-service/:professionalId/:serviceId
router.put('/professional-service/update', updateProfessionalService);

router.delete('/:id', deleteService);



export default router;
