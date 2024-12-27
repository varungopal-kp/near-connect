import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  username: Joi.string().required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "any.required": "Username is required",
  }),
  email: Joi.string().email({ tlds: { allow: false  } }).required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().min(6).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.base": "Confirm Password must be a string",
    "string.empty": "Confirm Password cannot be empty",
    "any.required": "Confirm Password is required",
    "any.only": "Confirm Password must match Password",
  }),
});

export { registerSchema };
