import express from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import notFoundMiddleware from './middlewares/notfound.middleware';
import logger from './helpers/logger';
import routes from './api/routes/api/v1';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import helmet from 'helmet';
import swaggerDocument from './configs/swagger.config';
import cors from 'cors';
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
app.use(cors());

// Swagger
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//Health check
app.get('/api/v1/healthcheck', (req, res, next) => {
  res.status(StatusCodes.OK).json({ success: true, message: 'Health check!' });
});
//All Routes
app.use('/api/v1/', routes);

// End of express middlewares stack

//Not Found middleware
app.use(notFoundMiddleware);
// Error Handling middleware
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    logger.info('DB Connected');
    app.listen(port, () => {
      logger.info(`Server is listening on http://${HOST}:${port}`);
      logger.info(`Docs URL: http://${HOST}:${port}/api/v1/docs`);
    });
  } catch (err) {
    logger.error(err);
  }
};
start();
export default app;
