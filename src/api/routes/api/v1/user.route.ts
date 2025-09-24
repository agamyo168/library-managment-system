import { Router } from 'express';
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
} from '../../../../middlewares/validation.middleware';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { UserController } from '../../../controllers/user.controller';
import { paramIdSchema } from '../../../../schemas/schema';
import { userSchema } from '../../../../schemas/user.schema';

export default function userRoutes(userController: UserController): Router {
  const router = Router();

  router.put(
    //Probably should use PATCH and allow any changes
    '/:id',
    authHandlerMiddleware(),
    validateBodyMiddleware(userSchema),
    validateParamsMiddleware(paramIdSchema),
    (req, res, next) => userController.update(req, res, next)
  );
  //Should be Admin only
  router.delete(
    '/:id',
    authHandlerMiddleware(),
    validateParamsMiddleware(paramIdSchema),
    (req, res, next) => userController.delete(req, res, next)
  );
  //Should be Admin only
  router.get('/', authHandlerMiddleware(), (req, res, next) =>
    userController.findAll(req, res, next)
  );

  return router;
}
