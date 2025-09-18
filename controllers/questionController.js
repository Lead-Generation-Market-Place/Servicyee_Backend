import questionService from '../services/question.js';

export const createQuestion = async (req, res, next) => {
  try {
    const data = req.body;
    const question = await questionService.createQuestion(data);
    res.status(201).json({ data: question });
  } catch (error) {
    next(error);
  }
};

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.status(200).json({ data: questions });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestionById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ data: question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedQuestion = await questionService.updateQuestion(id, data);
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ data: updatedQuestion });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await questionService.deleteQuestion(id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({message:"Question deleted successfully."});
  } catch (error) {
    next(error);
  }
};
