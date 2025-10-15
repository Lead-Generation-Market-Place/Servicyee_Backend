import Joi from "joi";

const businessTypes = ["company", "individual", "sub-contractor"];
const mediaTypes = ["photo", "video"];
const openClose = ["open", "close"];

export const professionalSchema = Joi.object({
  user_id: Joi.string().optional(),
  business_name: Joi.string().required(),
  introduction: Joi.string().optional(),
  business_type: Joi.string()
    .valid(...businessTypes)
    .required(),
  website: Joi.string().optional(),
  founded_year: Joi.number().min(1900).max(new Date().getFullYear()).optional(),
  employees: Joi.number().min(1).optional(),
  profile_image: Joi.string().uri().optional(),
  total_hire: Joi.number().optional(),
  total_review: Joi.number().optional(),
  rating_avg: Joi.number().optional(),
  profile_image: Joi.string()
    .pattern(/\.(jpg|jpeg|png)$/i)
    .message("Profile image must be a .jpg or .png file")
    .optional(),
  payment_methods: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .optional(),
  portfolio: Joi.array()
    .items(
      Joi.object({
        service_id: Joi.string().required(),
        media_type: Joi.string()
          .valid(...mediaTypes)
          .required(),
        media_url: Joi.string().uri().required(),
      })
    )
    .optional(),
  business_hours: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .valid(...openClose)
          .optional(),
        start_time: Joi.date().optional(),
        end_time: Joi.date().optional(),
        day: Joi.number().min(0).max(6).optional(),
      })
    )
    .optional(),
  specializations: Joi.array()
    .items(
      Joi.object({
        service_id: Joi.string().required(),
        specialization_tag: Joi.string().required(),
      })
    )
    .optional(),
});



export const createProAccountSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "string.empty": "Business name is required",
    "string.min": "Business name must be at least 3 characters",
  }),
  businessType: Joi.string().required().messages({
    "string.empty": "Please select a business type",
  }),
  country: Joi.string().min(2).required().messages({
    "string.empty": "Please select a country",
    "string.min": "Country must be at least 2 characters",
  }),
  streetAddress: Joi.string().min(3).required().messages({
    "string.empty": "Street address is required",
  }),
  city: Joi.string().min(2).required().messages({
    "string.empty": "City is required",
  }),
  region: Joi.string().min(2).required().messages({
    "string.empty": "State/Province is required",
  }),
  postalCode: Joi.string().min(3).required().messages({
    "string.empty": "Postal code is required",
  }),
  website: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Enter a valid URL",
  }),
  firstName: Joi.string().min(2).required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).required().messages({
    "string.empty": "Phone number is required",
    "string.min": "Phone number must be at least 10 digits",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  repassword: Joi.string().min(8).required().messages({
    "string.empty": "Please re-enter your password",
    "string.min": "Password must be at least 8 characters",
  }),
  categories: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Please select at least one category",
  }),
  subCategories: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Please select at least one subcategory",
  }),
  services_id: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Please select at least one service",
  }),
}).custom((value, helpers) => {
  if (value.password !== value.repassword) {
    return helpers.error("any.custom", { message: "Passwords do not match" });
  }
  return value;
});