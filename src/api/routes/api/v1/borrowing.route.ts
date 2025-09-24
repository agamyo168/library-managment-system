import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { bookIdSchema, bookSchema } from '../../../../schemas/book.schema';
import { BorrowingController } from '../../../controllers/borrowing.controller';
import { checkoutBookIdSchema } from '../../../../schemas/borrowing.schema';

export default function borrowingRoute(
  borrowingController: BorrowingController
): Router {
  const router = Router();

  router.post(
    '/checkout/:bookId',
    authHandlerMiddleware(),
    validateParamsMiddleware(checkoutBookIdSchema),
    (req, res, next) => borrowingController.checkout(req, res, next)
  );

  return router;
}
