import express from 'express';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory ,
  getCategoryById
} from '../controllers/categoryController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', validateBody(createCategorySchema), addCategory);
router.get('/:id', getCategoryById);
router.put('/:id', validateBody(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
