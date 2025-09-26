import { Prisma, PrismaClient } from '@prisma/client';

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
   * Deletes a user by their unique id.
   * @param id the ID of the user to find.
   * @returns A promise that resolves to the user object, or null if no user is found.
   */
  async deleteById(id: number) {
    return this.prisma.user.delete({
      where: { id },
      omit: { password: true, createdAt: true, updatedAt: true },
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
   * Updates a user record in the database.
   * @param data The data to update the user.
   * @param id The id of the user.
   * @returns A promise that resolves to the newly updated user object.
   */
  async update(data: Prisma.UserUpdateInput, id: number) {
    return this.prisma.user.update({
      data,
      where: { id },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }

  /**
   * Retrieves all user records from the database.
   * @returns A promise that resolves to an array of all user objects.
   */
  async findAll() {
    return this.prisma.user.findMany({
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }
}
