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
  , toggleServiceStatus
} from '../controllers/serviceController.js';

import { validateBody } from '../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validators.js';
import  fileupload  from "../config/multer.js";
import { uploadFile } from '../controllers/ProfessionalController.js';

const router = express.Router();

// ✅ Static/specific routes first
router.get('/location', getProfessionalCount); // Needs to come before /:id
router.put('/toggle-service-status', toggleServiceStatus);
router.get('/auth/:id', getServicesOFAuthenticatedUser);
router.post('/asp', assignServiceToProfessional);

// ✅ General routes
router.get('/', getServices);
router.post('/', fileupload('service').single('image_url'),
 addServices);

// ✅ Dynamic route must be LAST
router.get('/:id', getServiceById);
router.put('/:id', fileupload('service').single('image_url'), updateService);
router.delete('/:id', deleteService);

export default router;
