import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/custom/unauthorized.error.class';
import logger from '../helpers/logger';

const authHandlerMiddleware = (roles: string[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const authHead = _req.headers.authorization;
    if (authHead == null || authHead.startsWith('Bearer') == false)
      return next(new UnauthorizedError(`invalid user token`));

    const token = authHead.split(' ')[1];
    try {
      const payload = jwt.verify(
        token,
        String(process.env.JWT_SECRET)
      ) as JwtPayload;
      if (roles.includes(payload.role) === false)
        return next(new UnauthorizedError(`unauthorized access`));
      res.locals.payload = payload;
      next();
    } catch (err) {
      logger.error(err);
      return next(new UnauthorizedError(`invalid user token`));
    }
  };
};

export default authHandlerMiddleware;
