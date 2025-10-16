import answerService from '../services/answer.js';

const formatErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export const createAnswer = async (req, res, next) => {
  try {
    const data = req.body;
    const newAnswer = await answerService.createAnswer(data);
    if (!newAnswer) {
      return formatErrorResponse(res, 500, 'Failed to create answer.');
    }
    res.status(201).json({ success: true, data: newAnswer });
  } catch (error) {
    // You can add logging here if needed
    next(error);
  }
};

export const createAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body; // Expecting { answers: [...] }
    
    if (!answers || !Array.isArray(answers)) {
      return formatErrorResponse(res, 400, 'Answers array is required');
    }

    const createdAnswers = await answerService.createMultipleAnswers(answers);
    
    if (!createdAnswers) {
      return formatErrorResponse(res, 500, 'Failed to create answers');
    }
    
    res.status(201).json({ 
      success: true, 
      data: createdAnswers,
      message: `${createdAnswers.length} answers created successfully` 
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAnswers = async (req, res, next) => {
  try {
    const answers = await answerService.getAllAnswers();
    res.json({ success: true, data: answers });
  } catch (error) {
    next(error);
  }
};

export const getAnswerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const answer = await answerService.getAnswerById(id);
    if (!answer) {
      return formatErrorResponse(res, 404, `Answer with id '${id}' not found.`);
    }
    res.json({ success: true, data: answer });
  } catch (error) {
    next(error);
  }
};

export const updateAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await answerService.updateAnswer(id, req.body);
    if (!updated) {
      return formatErrorResponse(res, 404, `Answer with id '${id}' not found.`);
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await answerService.deleteAnswer(id);
    if (!deleted) {
      return formatErrorResponse(res, 404, `Answer with id '${id}' not found.`);
    }
    res.json({ success: true, message: 'Answer deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
