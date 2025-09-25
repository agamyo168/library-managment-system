import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../schemas/user.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';

export class UserController {
  constructor(private userService: UserService) {}
  async update(
    req: Request<any, unknown, UserDto>,
    res: Response,
    next: NextFunction
  ) {
    const { id }: { id: number } = req.params;
    const user = await this.userService.update(req.body, Number(id));
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User has been updated successfully!',
      data: user,
    });
  }
  async findAll(_req: Request, res: Response, next: NextFunction) {
    const users = await this.userService.findAll();
    res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  }
  async delete(req: Request<any>, res: Response, next: NextFunction) {
    const { id }: { id: number } = req.params;
    const deletedUser = await this.userService.delete(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User has been deleted successfully!',
      data: deletedUser,
    });
  }
}
