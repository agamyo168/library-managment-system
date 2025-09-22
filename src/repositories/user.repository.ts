// src/repositories/user.repository.ts

import { Prisma, PrismaClient } from '../generated/prisma';
import logger from '../helpers/logger';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  // Retrieves a single user by their ID
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Retrieves a single user by their email
  async findByEmail(email: string) {
    logger.info({ name: UserRepository.name, data: email });
    return this.prisma?.user.findUnique({
      where: { email },
    });
  }

  // Creates a new user record in the database
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  // Gets a list of all users from the database
  async findAll() {
    return this.prisma.user.findMany();
  }
}
