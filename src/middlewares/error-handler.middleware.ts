import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import CustomError from '../errors/custom/custom.error.class';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';

const errorHandlerMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      err.message = 'Resource does not exist';
    }
    if (err.code === 'P2002' && err.meta) {
      err.message = `Resource already exists`;
    }
  }
  const status = err?.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const error = err.message || 'Internal server error try again later.';
  res.status(status).json({
    success: false,
    error,
  });
  return next();
};

export default errorHandlerMiddleware;
