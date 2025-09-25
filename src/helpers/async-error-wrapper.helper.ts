import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const asyncWrapper = (
  cb: (req: Request<any>, res: Response, next: NextFunction) => any,
  name: string = 'Controller Error'
) => {
  return (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      return cb(req, res, next);
    } catch (err) {
      logger.error({ name, err });
      return next(err);
    }
  };
};
export default asyncWrapper;
