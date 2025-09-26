import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { bookIdSchema, bookSchema } from '../../../../schemas/book.schema';
import { BorrowingController } from '../../../controllers/borrowing.controller';
import {
  borrowingSchema,
  checkoutBookIdSchema,
} from '../../../../schemas/borrowing.schema';
import { paramIdSchema } from '../../../../schemas/schema';
import { UserRoleEnum } from '../../../../constants/enums/roles';
import asyncWrapper from '../../../../helpers/async-error-wrapper.helper';

export default function borrowingRoute(
  borrowingController: BorrowingController
): Router {
  const router = Router();

  router.post(
    '/',
    authHandlerMiddleware(),
    validateBodyMiddleware(borrowingSchema),
    asyncWrapper(borrowingController.checkout)
  );

  router.patch(
    '/:id/return',
    authHandlerMiddleware(),
    validateParamsMiddleware(paramIdSchema),
    asyncWrapper(borrowingController.return)
  );

  router.get(
    '/me',
    authHandlerMiddleware(),
    asyncWrapper(borrowingController.getMyBorrowedBooks)
  );

  //Should probably move this to a separate controller -> Admin or Dashboard controller probably
  router.get(
    '/',
    authHandlerMiddleware([UserRoleEnum.ADMIN]), // I think for such endpoints it's better to send back Not Found Error from a security POV
    asyncWrapper(borrowingController.getAllBorrowedBooksAndBorrowers)
  );
  // router.get(
  //   '/admin/due-dates',
  //   authHandlerMiddleware([UserRoleEnum.ADMIN]),
  //   asyncWrapper(borrowingController.fetchPastDueDateBooks)
  // );

  return router;
}
