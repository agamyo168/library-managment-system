import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaTx } from '../types';

export class BookRepository {
  constructor(private prisma: PrismaClient | PrismaTx) {}

  /**
   * Finds a book by its unique ID.
   * @param id The ID of the book to find.
   * @returns The book object or null if not found.
   */
  async findById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new book record in the database.
   * @param data The data for the new book.
   * @returns The newly created book object.
   */
  async create(data: Prisma.BookCreateInput) {
    return this.prisma.book.create({
      data,
    });
  }

  /**
   * Updates an existing book record.
   * @param id The ID of the book to update.
   * @param data The data to update.
   * @returns The updated book object.
   */
  async update(id: number, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }
  /**
   * Updates an existing book quantity.
   * @param id The ID of the book to update.
   * @param increment the amount to increment/decrement.
   * @returns The updated book object.
   */
  async changeBookQuantity(id: number, increment: number) {
    return this.prisma.book.update({
      where: { id },
      data: {
        quantity: { increment },
      },
    });
  }
  /**
   * Deletes a book record by its ID.
   * @param id The ID of the book to delete.
   * @returns The deleted book object.
   */
  async delete(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }

  /**
   * Retrieves all book records from the database.
   * @param searchString An optional string to filter books by title, author, or ISBN.
   * @returns A list of all book objects.
   */
  async findAll(searchString?: string, page: number = 1, limit: number = 10) {
    let whereOptions: any = {};
    if (searchString) {
      whereOptions = {
        OR: [
          {
            title: {
              contains: searchString,
              mode: 'insensitive', // For case-insensitive search on PostgreSQL
            },
          },
          {
            author: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            isbn: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    // If a search string is provided, construct a complex WHERE clause.
    return this.prisma.book.findMany({
      where: { ...whereOptions },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
