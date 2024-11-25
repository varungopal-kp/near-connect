import Joi from "joi";

const commentSchema = Joi.object({
  comment: Joi.string().required().messages({
    "string.base": "Comment must be a string",
    "string.empty": "Comment cannot be empty",
    "any.required": "Comment is required",
  }),
});

const replySchema = Joi.object({
  reply: Joi.string().required().messages({
    "string.base": "Reply must be a string",
    "string.empty": "Reply cannot be empty",
    "any.required": "Reply is required",
  }),
  comment: Joi.string().required(),
});

export { commentSchema, replySchema };
