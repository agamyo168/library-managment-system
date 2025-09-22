import Joi, { ObjectSchema } from 'joi';

const signInSchema: ObjectSchema = Joi.object({
  email: Joi.string().min(6).required(),
  password: Joi.string().min(8).required(),
});
const userSchema: ObjectSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required(),
  password: Joi.string().min(8).required(),
});

export { userSchema, signInSchema };
