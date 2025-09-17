import express from 'express';
import { 
  getSubCategories, 
  addSubCategory, 
  updateSubCategory, 
  deleteSubCategory 
} from '../controllers/subCategoryController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createSubCategorySchema, updateSubCategorySchema } from '../validators/subcategory.validators.js';

const router = express.Router();

router.get('/', getSubCategories);  // can accept ?category=categoryId
router.post('/', validateBody(createSubCategorySchema), addSubCategory);
router.put('/:id', validateBody(updateSubCategorySchema), updateSubCategory);
router.delete('/:id', deleteSubCategory);

export default router;
