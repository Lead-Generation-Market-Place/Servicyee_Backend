import express from 'express';
import { 
  getSubCategories, 
  addSubCategory, 
  updateSubCategory, 
  deleteSubCategory,
  getAllSubCategoriesWithServicesCount,
  getSubCategoryById
} from '../controllers/subCategoryController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createSubCategorySchema, updateSubCategorySchema } from '../validators/subcategory.validators.js';
import fileupload from '../config/multer.js';

const router = express.Router();

router.get('/with-service-count', getAllSubCategoriesWithServicesCount);
router.get('/', getSubCategories);  // can accept ?category=categoryId
router.post('/', fileupload('SubCategory').single("subcategory_image_url"), addSubCategory);
router.put('/:id', fileupload('SubCategory').single("subcategory_image_url"), updateSubCategory);
router.get('/:id', getSubCategoryById);
router.delete('/:id', deleteSubCategory);

export default router;
