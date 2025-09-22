// src/controllers/user.controller.ts
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import ConflictError from '../../errors/custom/conflict.error.class';

export class AuthController {
  constructor(private userService: UserService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      // The controller passes the request data to the service
      logger.info({ name: AuthController.name, body: { ...req.body } });
      await this.userService.createUser(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Account has been created successfully!',
      });
    } catch (err) {
      return next(err);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      //Get email and password --> Validated with JOI
      const { email, password } = req.body;

      //Authenticate email and password
      const token = await this.userService.authenticate({ email, password });
      //return token
      res.status(StatusCodes.OK).json({
        success: true,
        data: token,
      });
    } catch (err) {
      //Throw Error if wrong email or password
      return next(err);
    }
  }
}
