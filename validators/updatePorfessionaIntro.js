import { Joi } from 'celebrate';

export const updateIntroductionSchema = Joi.object({
  introduction: Joi.string().required()
});