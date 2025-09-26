import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../repositories/user.repository';
import { PEPPER, SALT } from '../constants/secrets';
import { UserDto, LoginDto } from '../schemas/user.schema';
import NotFound from '../errors/custom/notfound.error.class';
import { Prisma } from '@prisma/client';

//TODO: Probably should create an AuthService separate from UserService
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async createUser(dto: UserDto) {
    dto.password = await this.hashPassword(dto.password);
    const user = await this.userRepo.create(dto);
    return user;
  }
  async findAll() {
    return this.userRepo.findAll();
  }
  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }
  async findById(id: number) {
    return this.userRepo.findById(id);
  }
  async update(dto: Prisma.UserUpdateInput, id: number) {
    //When updating password hash the new one
    if (dto.password && typeof dto.password === 'string')
      dto.password = await this.hashPassword(dto.password);

    const user = await this.userRepo.update(dto, id);
    if (!user) throw new NotFound('User not found');
    return user;
  }
  async delete(id: number) {
    const user = await this.userRepo.deleteById(id);
    if (!user) throw new NotFound('User not found');
    return user;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT));
    return bcrypt.hash(password + PEPPER, salt);
  }
}
