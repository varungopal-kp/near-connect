const Joi = require("joi");
const user = require("../models/user");

// Post validation schema
const postSchema = Joi.object({
  content: Joi.string().trim().required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content cannot be empty",
    "any.required": "Content is required",
  }),
  fileType:Joi.string().trim().optional(),
});

// Comment validation schema
const commentSchema = Joi.object({
  comment: Joi.string().trim().required().messages({
    "string.base": "Comment must be a string",
    "string.empty": "Comment cannot be empty",
    "any.required": "Comment is required",
  }),
  post: Joi.string().trim().required(),
});

const replySchema = Joi.object({
  reply: Joi.string().trim().required().messages({
    "string.base": "Reply must be a string",
    "string.empty": "Reply cannot be empty",
    "any.required": "Reply is required",
  }),
  comment: Joi.string().trim().required(),
});

module.exports = {
  postSchema,
  commentSchema,
  replySchema,
};
