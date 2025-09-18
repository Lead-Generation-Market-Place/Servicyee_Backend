import Joi from 'joi';

const businessTypes = ['company', 'individual', 'sub-contractor'];
const mediaTypes = ['photo', 'video'];
const openClose = ['open', 'close'];

export const professionalSchema = Joi.object({
  user_id: Joi.string().optional(),
  business_name: Joi.string().required(),
  introduction: Joi.string().optional(),
  business_type: Joi.string().valid(...businessTypes).required(),
  total_hire: Joi.number().optional(),
  total_review: Joi.number().optional(),
  rating_avg: Joi.number().optional(),
  portfolio: Joi.array().items(
    Joi.object({
      service_id: Joi.string().required(),
      media_type: Joi.string().valid(...mediaTypes).required(),
      media_url: Joi.string().uri().required()
    })
  ).optional(),
  business_hours: Joi.array().items(
    Joi.object({
      service_id: Joi.string().optional(),
      status: Joi.string().valid(...openClose).optional(),
      start_time: Joi.date().optional(),
      end_time: Joi.date().optional(),
      day: Joi.number().min(0).max(6).optional()
    })
  ).optional(),
  specializations: Joi.array().items(
    Joi.object({
      service_id: Joi.string().required(),
      specialization_tag: Joi.string().required()
    })
  ).optional()
});
