import Joi from "joi";

const postSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.base": "Post must be a string",
    "string.empty": "Post cannot be empty",
    "any.required": "Post is required",
  }),
});

export { postSchema };
