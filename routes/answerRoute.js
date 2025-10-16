import express from 'express';
import {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer
} from '../controllers/answerController.js';

const router = express.Router();

router.get('/', getAllAnswers);
router.get('/:id', getAnswerById);
router.post('/', 
 
    createAnswer);
router.put('/:id', updateAnswer);
router.delete('/:id', deleteAnswer);

export default router;
