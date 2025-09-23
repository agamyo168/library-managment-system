import Joi, { ObjectSchema } from 'joi';

const bookSchema: ObjectSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  shelfLocation: Joi.string().required(),
});

interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  shelfLocation: string;
}
export { bookSchema, CreateBookDto };
