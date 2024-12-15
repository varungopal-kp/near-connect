import Joi from "joi";

const profileSchema = Joi.object({
  about: Joi.string().required().min(30).messages({
    "string.base": "must be a string",
    "string.empty": " cannot be empty",
    "any.required": " is required",
    "string.min": " must be at least 30 characters long",
  }),
  place: Joi.string().required().min(3).max(30).messages({
    "string.base": " must be a string",
    "string.empty": " cannot be empty",
    "any.required": "  required",
    "string.min": " must be at least 3 characters long",
    "string.max": " must be at most 30 characters long",
  }),
}).unknown();

export { profileSchema };
