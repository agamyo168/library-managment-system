import { Prisma, PrismaClient } from '../generated/prisma';
import logger from '../helpers/logger';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Finds a user by their unique ID.
   * @param id The ID of the user to find.
   * @returns A promise that resolves to the user object, or null if no user is found.
   */
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a user by their unique email address.
   * @param email The email address of the user to find.
   * @returns A promise that resolves to the user object, or null if no user is found.
   */
  async findByEmail(email: string) {
    return this.prisma?.user.findUnique({
      where: { email },
    });
  }

  /**
   * Creates a new user record in the database.
   * @param data The data for the new user.
   * @returns A promise that resolves to the newly created user object.
   */
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Retrieves all user records from the database.
   * @returns A promise that resolves to an array of all user objects.
   */
  async findAll() {
    return this.prisma.user.findMany();
  }
}
