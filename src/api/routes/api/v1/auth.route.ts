import { Router } from 'express';
import { AuthController } from '../../../controllers/auth.controller';
import { validateBodyMiddleware } from '../../../../middlewares/validation.middleware';
import { signInSchema, userSchema } from '../../../../schemas/user.schema';

// This function receives the controller instance
export default function authRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/signup', validateBodyMiddleware(userSchema), (req, res, next) =>
    authController.signup(req, res, next)
  );
  router.post(
    '/login',
    validateBodyMiddleware(signInSchema),
    (req, res, next) => authController.login(req, res, next)
  );

  return router;
}
