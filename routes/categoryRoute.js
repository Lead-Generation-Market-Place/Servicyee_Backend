import express from 'express';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory ,
  getCategoryById,
  getAllWithServiceCount
} from '../controllers/categoryController.js';

import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.js';
import fileupload from '../config/multer.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', getCategories);
router.get('/with-service-count', getAllWithServiceCount);
router.post('/', fileupload('category').single('category_image_url'), addCategory);
router.get('/:id', getCategoryById);
router.put('/:id', fileupload('category').single('category_image_url'), updateCategory);
router.delete('/:id', deleteCategory);


export default router;
