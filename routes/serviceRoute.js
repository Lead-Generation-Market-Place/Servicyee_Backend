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
  
} from '../controllers/serviceController.js';

import { validateBody } from '../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validators.js';

const router = express.Router();

// ✅ Static/specific routes first
router.get('/location', getProfessionalCount); // Needs to come before /:id
router.get('/auth/:id', getServicesOFAuthenticatedUser);
router.post('/asp', assignServiceToProfessional);

// ✅ General routes
router.get('/', getServices);
router.post('/', validateBody(createServiceSchema), addServices);

// ✅ Dynamic route must be LAST
router.get('/:id', getServiceById);
router.put('/:id', validateBody(updateServiceSchema), updateService);
router.delete('/:id', deleteService);

export default router;
