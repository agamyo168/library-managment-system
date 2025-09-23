import { Router } from 'express';
import { validateBodyMiddleware } from '../../../../middlewares/validation.middleware';
import { signInSchema, userSchema } from '../../../../schemas/user.schema';
import { BookController } from '../../../controllers/book.controller';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';

// This function receives the controller instance
export default function bookRoutes(bookController: BookController): Router {
  const router = Router();

  router.post(
    '/',
    authHandlerMiddleware(), //Should be admin role
    validateBodyMiddleware(userSchema),
    (req, res, next) => bookController.addBook(req, res, next)
  );
  router.put(
    '/:id',
    authHandlerMiddleware(),
    validateBodyMiddleware(signInSchema),
    (req, res, next) => bookController.updateBook(req, res, next)
  );
  router.delete('/:id', authHandlerMiddleware(), (req, res, next) =>
    bookController.deleteBook(req, res, next)
  );
  router.get('/', authHandlerMiddleware(), (req, res, next) =>
    bookController.getAllBooks(req, res, next)
  );

  return router;
}
