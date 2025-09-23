import { Prisma, PrismaClient } from '../generated/prisma';

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

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
  async findAll(searchString?: string) {
    if (!searchString) return this.prisma.book.findMany(); // If no search string is provided, return all books without filtering.

    // If a search string is provided, construct a complex WHERE clause.
    return this.prisma.book.findMany({
      where: {
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
      },
    });
  }
}
