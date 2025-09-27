import Joi from 'joi';

export const createQuestionSchema = Joi.object({
  service_id: Joi.string().required(),
  question_name: Joi.string().required(),
  form_type: Joi.string()
    .valid('checkbox', 'radio', 'text', 'select', 'number', 'date')
    .required(),
  options: Joi.array().items(Joi.string()).optional(),
  required: Joi.boolean().optional(),
  order: Joi.number().integer().optional(),
  active: Joi.boolean().optional()
});

export const updateQuestionSchema = Joi.object({
  service_id: Joi.string().optional(),
  question_name: Joi.string().optional(),
  form_type: Joi.string()
    .valid('checkbox', 'radio', 'text', 'select', 'number', 'date')
    .optional(),
  options: Joi.array().items(Joi.string()).optional(),
  required: Joi.boolean().optional(),
  order: Joi.number().integer().optional(),
  active: Joi.boolean().optional()
});
