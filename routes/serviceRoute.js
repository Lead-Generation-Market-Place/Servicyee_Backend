import express from 'express';
import { 
  getServices, 
  addServices, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validators.js';



const router = express.Router();

router.get('/', getServices);
router.post('/', validateBody(createServiceSchema), addServices);
router.put('/:id', validateBody(updateServiceSchema), updateService);
router.delete('/:id', deleteService);

export default router;
