import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import BadRequestError from '../errors/custom/bad.request.error.class';

const validateBodyMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(new BadRequestError(`${error.details[0].message}`));
    }
    next();
  };
};
const validateParamsMiddleware =
  (schema: Schema) => (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(new BadRequestError(`${error.details[0].message}`));
    }

    next();
  };
const validateQueryMiddleware = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(new BadRequestError(`${error.details[0].message}`));
    }
    next();
  };
};
export {
  validateBodyMiddleware,
  validateParamsMiddleware,
  validateQueryMiddleware,
};
