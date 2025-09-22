import express from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import notFoundMiddleware from './middlewares/notfound.middleware';
import logger from './helpers/logger';
import routes from './api/routes/api/v1';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import helmet from 'helmet';
// import swaggerDocument from './configs/swagger.config';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';
import { AuthController } from './api/controllers/auth.controller';
import authRoutes from './api/routes/api/v1/auth.route';
import { loginRateLimiter } from './middlewares/rate-limiter.middleware';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
dotenv.config();
const { PORT, HOST } = process.env;
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
    const userRepository = new UserRepository(prisma);
    const userService = new UserService(userRepository);
    const authController = new AuthController(userService);

    //Router
    const router = express.Router();
    router.use(loginRateLimiter);
    router.use('/auth', authRoutes(authController));
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
