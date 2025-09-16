import Joi from 'joi';

const serviceTypes = ['active', 'deactive'];

// Schema for creating a service (name required, status optional with default)
export const createServiceSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid(...serviceTypes).default('active'),
});

// Schema for updating a service (both fields optional)
export const updateServiceSchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid(...serviceTypes).optional(),
});
