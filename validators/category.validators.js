import Joi from 'joi';

const categoryTypes = ['active', 'deactive'];

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid(...categoryTypes).default('active'),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid(...categoryTypes).optional(),
});
