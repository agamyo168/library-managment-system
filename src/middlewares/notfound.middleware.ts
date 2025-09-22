import { Request, Response, NextFunction } from 'express';
import NotFound from '../errors/custom/notfound.error.class';
const notFoundMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  return next(new NotFound("This resource doesn't exist"));
};

export default notFoundMiddleware;
