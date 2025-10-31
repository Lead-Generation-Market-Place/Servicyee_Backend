import Joi from "joi";

export const leadValidationSchema = Joi.object({
  service_id: Joi.string().required(),
  user_id: Joi.string().required(),
  title: Joi.string().required().max(150),
  note: Joi.string().allow("", null),
  
  answers: Joi.array().items(
    Joi.object({
      question_id: Joi.string().required(),
      answer: Joi.alternatives().try(
        Joi.string(),
        Joi.boolean(),
        Joi.number(),
        Joi.array().items(Joi.string(), Joi.number(), Joi.boolean())
      )
    })
  ).default([]),

  files: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      type: Joi.string().valid("image", "file", "video").default("image")
    })
  ).default([]),

  user_location: Joi.object({
    city: Joi.string().allow(null, ""),
    state: Joi.string().allow(null, ""),
    postcode: Joi.string().allow(null, "")
  }).default({}),

  professionals: Joi.array().items(Joi.string()),

  send_option: Joi.string().valid("top5", "selected").default("selected"),
});
