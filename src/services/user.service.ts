import jwt from 'jsonwebtoken';

import { LoginParams, UserParams } from '../types/users/user.interface';
import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import BadRequestError from '../errors/custom/bad.request.error.class';
import { UserRepository } from '../repositories/user.repository';
import UnauthorizedError from '../errors/custom/unauthorized.error.class';
import ConflictError from '../errors/custom/conflict.error.class';
import logger from '../helpers/logger';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';

dotenv.config();

const {
  JWT_SECRET: JWT,
  JWT_EXPIRE: EXPIRE,
  BCRYPT_SALT_ROUNDS,
  BCRYPT_SECRET_PEPPER,
} = process.env;

export class UserService {
  private readonly userRepo: UserRepository;
  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }
  async isValidEmail(email: string): Promise<boolean> {
    const user = await this.userRepo.findByEmail(email);
    return user == null;
  }
  async createUser(userParams: UserParams) {
    try {
      const user = await this.userRepo.create(userParams);
      return user;
    } catch (err) {
      logger.error(err);
      //P2002 is unique constraint error in prisma
      if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002')
        err = new ConflictError('email already exists');
      throw err;
    }
  }
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_ROUNDS));
    return bcrypt.hash(password + BCRYPT_SECRET_PEPPER, salt);
  }
  private generateToken(id: number) {
    return jwt.sign({ id }, `${JWT}`, {
      expiresIn: `${EXPIRE}`,
    });
  }
  private async comparePasword(hashedPassword: string, password: string) {
    return bcrypt.compare(password + BCRYPT_SECRET_PEPPER, hashedPassword);
  }
  async authenticate(userParams: LoginParams) {
    const user = await this.userRepo.findByEmail(userParams.email);
    if (!user) throw new UnauthorizedError('invalid email or password'); //This error will be caught in the controller anyways and handled accordingly

    const isAuthenticated = this.comparePasword(
      user.password,
      userParams.password
    );
    if (!isAuthenticated) {
      throw new UnauthorizedError('invalid email or password');
    }
    const token = this.generateToken(user.id);
    return token;
  }
}
