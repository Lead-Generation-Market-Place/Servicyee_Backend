import express from 'express';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory ,
  getCategoryById,
  getAllWithServiceCount
} from '../controllers/categoryController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.js';
import fileupload from '../config/multer.js';
const router = express.Router();

router.get('/', getCategories);
router.get('/with-service-count', getAllWithServiceCount);
router.post('/', fileupload('category').single('category_image'), validateBody(createCategorySchema), addCategory);
router.get('/:id', getCategoryById);
router.put('/:id', fileupload('category').single('category_image'), validateBody(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);


export default router;
