import express from 'express';
import authRoute from './auth.route';
import authHandlerMiddleware from '../../../../middlewares/auth-handler.middleware';
import { validateBodyMiddleware } from '../../../../middlewares/validation.middleware';
import { userSchema } from '../../../../schemas/user.schema';
import { apiLimiter } from '../../../../middlewares/rate-limiter.middleware';

const router = express.Router();
router.use(apiLimiter);
router.use('/auth', validateBodyMiddleware(userSchema), authRoute);

export default router;
