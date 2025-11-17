import express from 'express';
import { 
  getSubCategories, 
  addSubCategory, 
  updateSubCategory, 
  deleteSubCategory,
  getAllSubCategoriesWithServicesCount,
  getSubCategoryById,
  getSubcategoryBySlugHandler,
  updateSubcategoryStatusHandler
} from '../controllers/subCategoryController.js';


import fileupload from '../config/multer.js';

const router = express.Router();

router.get('/with-service-count', getAllSubCategoriesWithServicesCount);
router.get('/', getSubCategories);  // can accept ?category=categoryId
router.post('/', fileupload('SubCategory').single("subcategory_image_url"), addSubCategory);
router.get('/:slug', getSubcategoryBySlugHandler);
router.put('/:id', fileupload('SubCategory').single("subcategory_image_url"), updateSubCategory);
router.get('/:id', getSubCategoryById);
router.delete('/:id', deleteSubCategory);

// ==========================================
//            Manage Subcategories
// ==========================================
router.put('/:id/status', updateSubcategoryStatusHandler);

export default router;
