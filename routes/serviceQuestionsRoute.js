import express from 'express';
import { getServiceQuestions } from '../controllers/serviceQuestionsController.js';

const router = express.Router();

router.get('/:serviceId/questions', getServiceQuestions);

export default router;