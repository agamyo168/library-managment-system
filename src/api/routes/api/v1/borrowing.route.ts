import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { bookIdSchema, bookSchema } from '../../../../schemas/book.schema';
import { BorrowingController } from '../../../controllers/borrowing.controller';
import { checkoutBookIdSchema } from '../../../../schemas/borrowing.schema';
import { paramIdSchema } from '../../../../schemas/schema';
import { UserRoleEnum } from '../../../../constants/enums/roles';
import asyncWrapper from '../../../../helpers/async-error-wrapper.helper';

export default function borrowingRoute(
  borrowingController: BorrowingController
): Router {
  const router = Router();

  router.post(
    '/checkout/:bookId',
    authHandlerMiddleware(),
    validateParamsMiddleware(checkoutBookIdSchema),
    asyncWrapper(borrowingController.checkout)
  );
  router.post(
    '/return/:id',
    authHandlerMiddleware(),
    validateParamsMiddleware(paramIdSchema),
    asyncWrapper(borrowingController.return)
  );
  router.get(
    'borrowed',
    authHandlerMiddleware(),
    asyncWrapper(borrowingController.fetchMyBorrowedBooks)
  );

  router
    .use(
      '/admin',
      authHandlerMiddleware([UserRoleEnum.ADMIN]) // I think for such endpoints it's better to send back Not Found Error from a security POV
    )
    .get(
      '',
      asyncWrapper(borrowingController.fetchAllBorrowedBooksAndBorrowers)
    )
    .get('due-dates', asyncWrapper(borrowingController.fetchPastDueDateBooks));

  return router;
}
