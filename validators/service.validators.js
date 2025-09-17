import Joi from 'joi';

const serviceTypes = ['active', 'deactive'];

export const createServiceSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid(...serviceTypes).default('active'),
// ✅ This matches your schema:
subCategory: Joi.string().required()

});

export const updateServiceSchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid(...serviceTypes).optional(),
// ✅ This matches your schema:
subCategory: Joi.string().required()

});
