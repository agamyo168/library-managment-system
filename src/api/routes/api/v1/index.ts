import express from 'express';
import { loginRateLimiter } from '../../../../middlewares/rate-limiter.middleware';
import authRoutes from './auth.route';
import { prisma } from '../../../../server';
import { UserRepository } from '../../../../repositories/user.repository';
import { UserService } from '../../../../services/user.service';
import { AuthController } from '../../../controllers/auth.controller';
//Dependency Injections:
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

//Router
const router = express.Router();
router.use(loginRateLimiter);
router.use('/auth', authRoutes(authController));

export default router;
