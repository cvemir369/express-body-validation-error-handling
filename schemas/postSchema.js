import Joi from "joi";

const postSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  content: Joi.string().min(3).max(100).required(),
  userId: Joi.number().integer().required(),
});

export default postSchema;
