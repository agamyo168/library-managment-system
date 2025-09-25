import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import { BookController } from '../../../controllers/book.controller';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { bookIdSchema, bookSchema } from '../../../../schemas/book.schema';
import { UserRoleEnum } from '../../../../constants/enums/roles';
import asyncWrapper from '../../../../helpers/async-error-wrapper.helper';

export default function bookRoutes(bookController: BookController): Router {
  const router = Router();

  router.post(
    '/',
    authHandlerMiddleware([UserRoleEnum.ADMIN]), //Should be admin role
    validateBodyMiddleware(bookSchema),
    asyncWrapper(bookController.addBook)
  );
  router.put(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateBodyMiddleware(bookSchema), //Same as create because we are using a put endpoint --- doesn't necessary have to create a resource js
    validateParamsMiddleware(bookIdSchema),
    asyncWrapper(bookController.updateBook)
  );
  router.delete(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateParamsMiddleware(bookIdSchema),
    asyncWrapper(bookController.deleteBook)
  );
  router.get(
    '/',
    authHandlerMiddleware(),
    asyncWrapper(bookController.getAllBooks)
  );

  return router;
}
