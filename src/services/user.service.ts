import jwt from 'jsonwebtoken';

import { LoginParams, UserParams } from '../types/users/user.interface';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/user.repository';
import UnauthorizedError from '../errors/custom/unauthorized.error.class';
import ConflictError from '../errors/custom/conflict.error.class';
import logger from '../helpers/logger';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import { EXPIRE, JWT, PEPPER, SALT } from '../constants/secrets';

//TODO: Probably should create an AuthService separate from UserService
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async createUser(userParams: UserParams) {
    try {
      const { password } = userParams;
      const hashedPassword = await this.hashPassword(password);
      const user = await this.userRepo.create({
        ...userParams,
        password: hashedPassword,
      });
      return user;
    } catch (err) {
      logger.error({ name: UserService.name, err });
      //P2002 is unique constraint error in prisma
      if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002')
        err = new ConflictError('email already exists');
      throw err;
    }
  }
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT));
    return bcrypt.hash(password + PEPPER, salt);
  }
  private generateToken(id: number) {
    return jwt.sign({ id }, `${JWT}`, {
      expiresIn: `${EXPIRE}`,
    });
  }
  private async comparePasword(hashedPassword: string, password: string) {
    return bcrypt.compare(password + PEPPER, hashedPassword);
  }
  async authenticate(dto: LoginParams) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('invalid email or password'); //This error will be caught in the controller anyways and handled accordingly

    const isAuthenticated = await this.comparePasword(
      user.password,
      dto.password
    );
    if (!isAuthenticated) {
      throw new UnauthorizedError('invalid email or password');
    }
    const token = this.generateToken(user.id);
    return token;
  }
}
