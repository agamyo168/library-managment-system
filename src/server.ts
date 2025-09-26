import express from 'express';
import { StatusCodes } from 'http-status-codes';
// import swaggerUi from 'swagger-ui-express';
import notFoundMiddleware from './middlewares/notfound.middleware';
import logger from './helpers/logger';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import helmet from 'helmet';
// import swaggerDocument from './configs/swagger.config';
import cors from 'cors';
import { AuthController } from './api/controllers/auth.controller';
import authRoutes from './api/routes/api/v1/auth.route';
import {
  loginRateLimiter,
  rateLimiter,
} from './middlewares/rate-limiter.middleware';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import bookRoutes from './api/routes/api/v1/book.route';
import { BookController } from './api/controllers/book.controller';
import { BookRepository } from './repositories/book.repository';
import { BookService } from './services/book.service';
import { AuthService } from './services/auth.service';
import { UserController } from './api/controllers/user.controller';
import userRoutes from './api/routes/api/v1/user.route';
import { HOST, PORT } from './constants/secrets';
import borrowingRoute from './api/routes/api/v1/borrowing.route';
import { BorrowingController } from './api/controllers/borrowing.controller';
import { BorrowingRepository } from './repositories/borrowing.repository';
import { BorrowingService } from './services/borrowing.service';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = PORT || 3000;

app.use(express.json());
//Security
const allowedOrigins = process.env.CORS_ORIGIN || '';
const allowedOriginsArray = allowedOrigins
  .split(',')
  .map((item) => item.trim()) || ['*'];

const corsOptions = {
  origin: allowedOriginsArray,
  optionSuccessStatus: 200,
  methods: '*',
};
app.use(express.json({ limit: '50kb' }));
app.use(helmet());
app.use(cors(corsOptions));

// Swagger
// app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//Health check
app.get('/api/v1/healthcheck', (req, res, next) => {
  res.status(StatusCodes.OK).json({ success: true, message: 'Health check!' });
});
//All Routes
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('DB Connected');
    /*Dependency Injections */
    const userRepository = new UserRepository(prisma);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const authService = new AuthService(userService);
    const authController = new AuthController(authService);

    const bookRepository = new BookRepository(prisma);
    const bookService = new BookService(bookRepository);
    const bookController = new BookController(bookService);

    const borrowingRepository = new BorrowingRepository(prisma);
    const borrowingService = new BorrowingService(borrowingRepository, prisma);
    const borrowingController = new BorrowingController(borrowingService);

    /*Router */
    const router = express.Router();
    router.use(rateLimiter); //Generate Rate limiter
    router.use('/auth', loginRateLimiter, authRoutes(authController));
    router.use('/users', userRoutes(userController));
    router.use('/books', bookRoutes(bookController));
    router.use('/borrowings', borrowingRoute(borrowingController));

    app.use('/api/v1/', router);

    // End of express middlewares stack
    //Not Found middleware
    app.use(notFoundMiddleware);
    // Error Handling middleware
    app.use(errorHandlerMiddleware);
    app.listen(port, () => {
      logger.info(`Server is listening on http://${HOST}:${port}`);
      logger.info(`Docs URL: http://${HOST}:${port}/api/v1/docs`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};
start();
export default app;
