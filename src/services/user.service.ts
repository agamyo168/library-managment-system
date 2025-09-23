import jwt from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/user.repository';
import UnauthorizedError from '../errors/custom/unauthorized.error.class';
import ConflictError from '../errors/custom/conflict.error.class';
import logger from '../helpers/logger';
import { EXPIRE, JWT, PEPPER, SALT } from '../constants/secrets';
import { CreateUserDto, LoginDto } from '../schemas/user.schema';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';

//TODO: Probably should create an AuthService separate from UserService
export class UserService {
  constructor(private userRepo: UserRepository) {}
  /**
   * Creates a new user record with a hashed password.
   * @param dto The data transfer object containing user information.
   * @returns A promise that resolves to the newly created user object.
   * @throws {ConflictError} if a user with the provided email already exists.
   */
  async createUser(dto: CreateUserDto) {
    try {
      const { password } = dto;
      const hashedPassword = await this.hashPassword(password);
      const user = await this.userRepo.create({
        ...dto,
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

  /**
   * Authenticates a user by checking their email and password.
   * @param dto The data transfer object containing login credentials.
   * @returns A promise that resolves to a JWT token if authentication is successful.
   * @throws {UnauthorizedError} if the email or password is invalid.
   */
  async authenticate(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('invalid email or password');

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

  /**
   * Hashes a plain text password using bcrypt.
   * @param password The password to hash.
   * @returns A promise that resolves to the hashed password string.
   */
  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT));
    return bcrypt.hash(password + PEPPER, salt);
  }

  /**
   * Generates a JWT token for a user.
   * @param id The ID of the user.
   * @returns A JWT token string.
   */
  private generateToken(id: number) {
    return jwt.sign({ id }, `${JWT}`, {
      expiresIn: `${EXPIRE}`,
    });
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param hashedPassword The hashed password from the database.
   * @param password The plain text password to compare.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  private async comparePasword(hashedPassword: string, password: string) {
    return bcrypt.compare(password + PEPPER, hashedPassword);
  }
}
