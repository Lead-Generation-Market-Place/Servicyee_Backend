import express from 'express';
import {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
  createAnswers
} from '../controllers/answerController.js';

const router = express.Router();

router.get('/', getAllAnswers);
router.get('/:id', getAnswerById);
router.post('/',createAnswer);
router.post('/answers',createAnswers);
router.put('/:id', updateAnswer);
router.delete('/:id', deleteAnswer);

export default router;
