import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { UserController } from '../../../controllers/user.controller';
import { paramIdSchema } from '../../../../schemas/schema';
import { updateSchema } from '../../../../schemas/user.schema';
import { UserRoleEnum } from '../../../../constants/enums/roles';
import asyncWrapper from '../../../../helpers/async-error-wrapper.helper';

export default function userRoutes(userController: UserController): Router {
  const router = Router();
  //User endpoint to update their personal Information.
  // router.patch('me')
  router.put(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateBodyMiddleware(updateSchema), //Validation probably could be shortened into just one method with object keys as input
    validateParamsMiddleware(paramIdSchema),
    asyncWrapper(userController.update)
  );
  //Should be Admin only
  router.delete(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateParamsMiddleware(paramIdSchema),
    asyncWrapper(userController.delete)
  );
  //Should be Admin only
  router.get(
    '/',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    asyncWrapper(userController.findAll)
  );

  return router;
}
