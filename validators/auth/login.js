import Joi from "joi";

export const loginJoiSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().trim().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters backend",
  }),
});


