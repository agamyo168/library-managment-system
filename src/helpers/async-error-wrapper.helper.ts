import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import ConflictError from '../errors/custom/conflict.error.class';

const asyncWrapper = (
  cb: (req: Request<any>, res: Response, next: NextFunction) => Promise<any>,
  name: string = 'Controller Error'
) => {
  return async (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      return await cb(req, res, next);
    } catch (err) {
      logger.error({ name, err });
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        let message = '';
        if (err.meta) {
          const target = err.meta.target as unknown as string[];
          message = `${target[0]} already exist/s`; // Probably should make standard errors for all conflict messages.
        }
        err = new ConflictError(message);
      }
      return next(err);
    }
  };
};
export default asyncWrapper;
