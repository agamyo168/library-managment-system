import jwt from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/user.repository';
import { EXPIRE, JWT, PEPPER, SALT } from '../constants/secrets';
import { UserDto, LoginDto } from '../schemas/user.schema';
import NotFound from '../errors/custom/notfound.error.class';
import logger from '../helpers/logger';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import ConflictError from '../errors/custom/conflict.error.class';

//TODO: Probably should create an AuthService separate from UserService
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async findAll() {
    return this.userRepo.findAll();
  }
  async update(dto: UserDto, id: number) {
    try {
      const user = await this.userRepo.update(dto, id);
      if (!user) throw new NotFound('User not found');
      return user;
    } catch (err) {
      logger.error({ name: UserService.name, err });
      if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002')
        err = new ConflictError('email already exists');
      throw err;
    }
  }
  async delete(id: number) {
    const user = await this.userRepo.deleteById(id);
    if (!user) throw new NotFound('User not found');
    return user;
  }
}
