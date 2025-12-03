import Joi from "joi";
export const updateServiceSchema = Joi.object({
  professional_id: Joi.string().required(),
  service_id: Joi.string().required(),
  service_status: Joi.boolean().optional(),
});

export const pricingSchema = Joi.object({
  professional_id: Joi.string().required(),
  service_id: Joi.string().required(),
  pricing_type: Joi.string().valid("fixed", "hourly", "Project Based", "custom").required(),
  minimum_price: Joi.number().required(),
  maximum_price: Joi.number().required(),
  completed_tasks: Joi.number().min(0).required(),
  description: Joi.string().optional(),
});
