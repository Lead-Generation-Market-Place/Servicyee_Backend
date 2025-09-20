import express from 'express';
import {
  getServices,
  addServices,
  updateService,
  deleteService,
  getServiceById,
  addServiceForSubCategory,
  getServicesOFAuthenticatedUser,serviceLocations
} from '../controllers/serviceController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validators.js';

const router = express.Router();

router.get('/', getServices);
router.get('/auth/:id', getServicesOFAuthenticatedUser);
router.get('/:id', getServiceById);
router.post('/', validateBody(createServiceSchema), addServices);
router.post('/subcategory', validateBody(createServiceSchema), addServiceForSubCategory);
router.put('/:id', validateBody(updateServiceSchema), updateService);
router.delete('/:id', deleteService);

router.get('/locations',serviceLocations);
export default router;
