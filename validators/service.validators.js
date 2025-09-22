import Joi from 'joi';

const pricingTypes = ['fixed', 'hourly'];

export const createServiceSchema = Joi.object({
  professional_id: Joi.string().optional(),
  service_name:Joi.string().optional(),
  subcategory_id: Joi.string().required(),
  location_id: Joi.string().optional(),
  maximum_price: Joi.number().optional(),
  minimum_price: Joi.number().optional(),
  service_status: Joi.boolean().optional(),
  description: Joi.string().optional(),
  portfolio_ids: Joi.array().items(Joi.string()).optional(),
  completed_tasks: Joi.number().optional(),
  featured_projects: Joi.array().items(Joi.string()).optional(),
  business_availability: Joi.boolean().optional(),
  pricing_type: Joi.string().valid(...pricingTypes).default('fixed')
});

export const updateServiceSchema = Joi.object({
  professional_id: Joi.string().optional(),
  category_id: Joi.string().optional(),
  subcategory_id: Joi.string().optional(),
  location_id: Joi.string().optional(),
  maximum_price: Joi.number().optional(),
  minimum_price: Joi.number().optional(),
  service_status: Joi.boolean().optional(),
  description: Joi.string().optional(),
  portfolio_ids: Joi.array().items(Joi.string()).optional(),
  completed_tasks: Joi.number().optional(),
  featured_projects: Joi.array().items(Joi.string()).optional(),
  business_availability: Joi.boolean().optional(),
  pricing_type: Joi.string().valid(...pricingTypes).optional()
});
