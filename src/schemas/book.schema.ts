import Joi, { ObjectSchema } from 'joi';

const bookSchema: ObjectSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  shelfLocation: Joi.string().required(),
});
const bookIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  shelfLocation: string;
}
interface BookParams {
  id: number;
}
interface GetBookQuery {
  search: string;
}
export { bookSchema, bookIdSchema, CreateBookDto, GetBookQuery, BookParams };
