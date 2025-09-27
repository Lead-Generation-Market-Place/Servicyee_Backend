import Joi from 'joi';


export const createWishlistsSchema = Joi.object({
  user_id: Joi.string().required(),
  service_id: Joi.string().required(),
});

