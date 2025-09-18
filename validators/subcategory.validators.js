import Joi from 'joi';

const subcategoryType = ['active', 'deactive'];

export const createSubCategorySchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid(...subcategoryType).default('active'),
  category: Joi.string().hex().length(24).required()  // MongoDB ObjectId validation
});

export const updateSubCategorySchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid(...subcategoryType).optional(),
  category: Joi.string().hex().length(24).optional()  // optional update for category
});
