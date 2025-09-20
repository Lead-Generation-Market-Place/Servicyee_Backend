import express from 'express';
import {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer
} from '../controllers/answerController.js';

import { validateBody } from '../middlewares/validate.middleware.js';
import { createAnswerSchema, updateAnswerSchema } from '../validators/answer.validator.js';

const router = express.Router();

router.get('/', getAllAnswers);
router.get('/:id', getAnswerById);
router.post('/', 
    validateBody(createAnswerSchema), 
    createAnswer);
router.put('/:id', validateBody(updateAnswerSchema), updateAnswer);
router.delete('/:id', deleteAnswer);

export default router;
