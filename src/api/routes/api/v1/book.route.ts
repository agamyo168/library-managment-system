import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import { BookController } from '../../../controllers/book.controller';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { bookIdSchema, bookSchema } from '../../../../schemas/book.schema';

export default function bookRoutes(bookController: BookController): Router {
  const router = Router();

  router.post(
    '/',
    authHandlerMiddleware(), //Should be admin role
    validateBodyMiddleware(bookSchema),
    (req, res, next) => bookController.addBook(req, res, next)
  );
  router.put(
    '/:id',
    authHandlerMiddleware(),
    validateBodyMiddleware(bookSchema), //Same as create because we are using a put endpoint --- doesn't necessary have to create a resource js
    validateParamsMiddleware(bookIdSchema),
    (req, res, next) => bookController.updateBook(req, res, next)
  );
  router.delete(
    '/:id',
    authHandlerMiddleware(),
    validateParamsMiddleware(bookIdSchema),
    (req, res, next) => bookController.deleteBook(req, res, next)
  );
  router.get('/', authHandlerMiddleware(), (req, res, next) =>
    bookController.getAllBooks(req, res, next)
  );

  return router;
}
