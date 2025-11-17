import express from 'express';
import {
  getLicenseTypes,
  addLicenseType,
  updateLicenseType,
  deleteLicenseType ,
  getLicenseTypeById
} from '../controllers/licenseTypeController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.get('/', getLicenseTypes);
router.post('/', addLicenseType);
router.get('/:id', getLicenseTypeById);
router.put('/:id', updateLicenseType);
router.delete('/:id', deleteLicenseType);

export default router;