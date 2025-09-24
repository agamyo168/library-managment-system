import Joi from 'joi';

export const paramIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
