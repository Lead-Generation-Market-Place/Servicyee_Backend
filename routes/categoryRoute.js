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
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authenticateToken, getCategories);
router.get('/with-service-count', authenticateToken, getAllWithServiceCount);
router.post('/', authenticateToken, fileupload('category').single('category_image'), validateBody(createCategorySchema), addCategory);
router.get('/:id', authenticateToken, getCategoryById);
router.put('/:id', authenticateToken, fileupload('category').single('category_image'), validateBody(updateCategorySchema), updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);


export default router;
