import Joi from "joi";

const profileSchema = Joi.object({
  about: Joi.string().required().min(30).messages({
    "string.base": "About must be a string",
    "string.empty": "About cannot be empty",
    "any.required": "About is required",
    "string.min": "About must be at least 30 characters long",
  }),
}).unknown();

export { profileSchema };
