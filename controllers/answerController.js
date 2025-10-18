import professionalServicesModel from '../models/professionalServicesModel.js';
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
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return formatErrorResponse(res, 400, 'Answers array is required');
    }

    // Extract service_id from first answer
    const service_id = answers[0]?.service_id;
    if (!service_id) {
      return formatErrorResponse(res, 400, 'service_id is required in answers');
    }

    // Optionally, collect all service_location_ids from answers
    // Suppose each answer may have a service_location_ids array
    const serviceLocationIds = new Set();
    answers.forEach(ans => {
      if (Array.isArray(ans.service_location_ids)) {
        ans.service_location_ids.forEach(locId => {
          serviceLocationIds.add(locId.toString());
        });
      }
    });

    // Create answers
    const createdAnswers = await answerService.createMultipleAnswers(answers);

    if (!createdAnswers || createdAnswers.length === 0) {
      return formatErrorResponse(res, 500, 'Failed to create answers');
    }

    // Extract professional_id and question_ids
    const professionalId = createdAnswers[0].professional_id;
    const questionIds = createdAnswers.map(ans => ans.question_id);

    // Prepare update object
    const updateObj = {
      $addToSet: {
        question_ids: { $each: questionIds }
      }
    };

    if (serviceLocationIds.size > 0) {
      updateObj.$addToSet.location_ids = { $each: Array.from(serviceLocationIds) };
    }

    // Update ProfessionalService
    await professionalServicesModel.updateOne(
      {
        professional_id: professionalId,
        service_id: service_id
      },
      updateObj
    );

    // Return success
    res.status(201).json({
      success: true,
      data: createdAnswers,
      message: `${createdAnswers.length} answers created successfully`,
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
