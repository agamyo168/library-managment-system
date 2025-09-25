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

export default function userRoutes(userController: UserController): Router {
  const router = Router();
  //User endpoint to update their personal Information.
  // router.patch('me')
  router.put(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateBodyMiddleware(updateSchema),
    validateParamsMiddleware(paramIdSchema),
    (req, res, next) => userController.update(req, res, next)
  );
  //Should be Admin only
  router.delete(
    '/:id',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    validateParamsMiddleware(paramIdSchema),
    (req, res, next) => userController.delete(req, res, next)
  );
  //Should be Admin only
  router.get(
    '/',
    authHandlerMiddleware([UserRoleEnum.ADMIN]),
    (req, res, next) => userController.findAll(req, res, next)
  );

  return router;
}
