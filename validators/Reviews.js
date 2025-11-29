import Joi from "joi";

const reviewTypes = ["pending", "approved", "rejected"];

export const createReviewSchema = Joi.object({
  user_id: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({ "string.pattern.base": "Invalid user_id format" }),

  professional_id: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({ "string.pattern.base": "Invalid professional_id format" }),

  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({ "number.base": "Rating must be a number between 1 and 5" }),

  message: Joi.string().required().messages({
    "string.empty": "Message cannot be empty",
  }),

  reply: Joi.object({
    message: Joi.string().optional(),
    createdAt: Joi.date().optional(),
  }).optional(),

  review_type: Joi.string()
    .valid(...reviewTypes)
    .optional()
    .default("pending"),

  tags: Joi.array().items(Joi.string()).optional(),

  helpful_by: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional(),

  media: Joi.array()
    .items(
      Joi.object({
        media_url: Joi.string(),
        type: Joi.string().valid("image", "video").default("image"),
      })
    )
    .optional(),
});
