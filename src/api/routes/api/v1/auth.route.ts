import { Router } from 'express';
import { AuthController } from '../../../controllers/auth.controller';
import { validateBodyMiddleware } from '../../../../middlewares/validation.middleware';
import { signInSchema, userSchema } from '../../../../schemas/user.schema';
import asyncWrapper from '../../../../helpers/async-error-wrapper.helper';

// This function receives the controller instance
export default function authRoutes(authController: AuthController): Router {
  const router = Router();

  router.post(
    '/signup',
    validateBodyMiddleware(userSchema),
    asyncWrapper(authController.signup)
  );
  router.post(
    '/login',
    validateBodyMiddleware(signInSchema),
    asyncWrapper(authController.login)
  );

  return router;
}
