import express from 'express';
import { 
  createQuestion, 
  getAllQuestions, 
  getQuestionById, 
  updateQuestion, 
  deleteQuestion ,
  getQuestionByServiceId
} from '../controllers/questionController.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createQuestionSchema, updateQuestionSchema } from '../validators/question.validator.js';

const router = express.Router();

router.post('/', validateBody(createQuestionSchema), createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/service/:id', getQuestionByServiceId);
router.put('/:id', validateBody(updateQuestionSchema), updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
