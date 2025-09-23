import Joi from 'joi';

export const createServiceSchema = Joi.object({
  service_name:Joi.string().optional(),
  subcategory_id: Joi.string().required(),
});

export const updateServiceSchema = Joi.object({
  service_name: Joi.string().optional(),
  subcategory_id: Joi.string().optional(),
});
