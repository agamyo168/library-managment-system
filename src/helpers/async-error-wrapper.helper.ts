import { Request, Response, NextFunction } from 'express';

const asyncWrapper = (
  cb: (req: Request<any>, res: Response, next: NextFunction) => Promise<any>,
  name: string = 'Controller Error'
) => {
  return async (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      return await cb(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};
export default asyncWrapper;
