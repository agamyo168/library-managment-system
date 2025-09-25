import jwt from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import UnauthorizedError from '../errors/custom/unauthorized.error.class';
import { EXPIRE, JWT, PEPPER } from '../constants/secrets';
import { UserDto, LoginDto, ChangePasswordDto } from '../schemas/user.schema';
import { UserService } from './user.service';
import BadRequestError from '../errors/custom/bad.request.error.class';

export class AuthService {
  constructor(private userService: UserService) {}
  async register(dto: UserDto) {
    return this.userService.createUser(dto);
  }
  async authenticate(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('invalid email or password');

    const isAuthenticated = await this.comparePasword(
      user.password,
      dto.password
    );
    if (!isAuthenticated) {
      throw new UnauthorizedError('invalid email or password');
    }
    const token = this.generateToken(user.id, user.role);
    return token;
  }
  async changePassword(dto: ChangePasswordDto, id: number) {
    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedError('User does not exist');
    if (!(await this.comparePasword(user.password, dto.oldPassword)))
      throw new BadRequestError('Wrong password');

    await this.userService.update({ password: dto.newPassword }, id);
  }
  private generateToken(id: number, role: string) {
    return jwt.sign({ id, role }, `${JWT}`, {
      expiresIn: `${EXPIRE}`,
    });
  }
  private async comparePasword(hashedPassword: string, password: string) {
    return bcrypt.compare(password + PEPPER, hashedPassword);
  }
}
