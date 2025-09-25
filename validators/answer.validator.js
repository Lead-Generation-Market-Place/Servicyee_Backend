import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, 'ObjectId validation');

export const createAnswerSchema = Joi.object({
  question_id: objectId.optional(),
  lead_id: objectId.optional(),
  professional_id: objectId.optional(),
  user_id: objectId.optional(),
  answers: Joi.any().optional()
});

export const updateAnswerSchema = Joi.object({
  question_id: objectId.optional(),
  lead_id: objectId.optional(),
  professional_id: objectId.optional(),
  user_id: objectId.optional(),
  answers: Joi.any().optional()
});
