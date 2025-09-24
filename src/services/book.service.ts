import { BookRepository } from '../repositories/book.repository';
import ConflictError from '../errors/custom/conflict.error.class';
import logger from '../helpers/logger';
import { Prisma, PrismaClient } from '../generated/prisma';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import NotFound from '../errors/custom/notfound.error.class';

export class BookService {
  constructor(private bookRepo: BookRepository) {}

  /**
   * Creates a new book record.
   * @param data The data for the new book.
   * @returns The newly created book object.
   * @throws {ConflictError} if a book with the same ISBN already exists.
   */
  async createBook(data: Prisma.BookCreateInput) {
    try {
      return await this.bookRepo.create(data);
    } catch (err) {
      logger.error({ name: BookService.name, err });
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictError('A book with this ISBN already exists.');
      }
      throw err;
    }
  }

  /**
   * Finds a book by its unique ID.
   * @param id The ID of the book to find.
   * @returns The book object or null if not found.
   */
  async findBookById(id: number) {
    const book = await this.bookRepo.findById(id);
    if (!book) throw new NotFound("This book doesn't exist");
    return book;
  }

  /**
   * Finds all books, with optional search filtering.
   * @param searchString An optional string to filter books by title, author, or ISBN.
   * @returns An array of book objects.
   */
  async findAllBooks(searchString?: string) {
    return this.bookRepo.findAll(searchString);
  }

  /**
   * Updates an existing book record.
   * @param id The ID of the book to update.
   * @param data The data to update.
   * @returns The updated book object.
   * @throws {ConflictError} if the updated ISBN already exists for another book.
   */
  async updateBook(id: number, data: Prisma.BookCreateInput) {
    try {
      return await this.bookRepo.update(id, data);
    } catch (err) {
      logger.error({ name: BookService.name, err });
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictError('A book with this ISBN already exists.');
      }
      throw err;
    }
  }

  /**
   * Deletes a book record by its unique ID.
   * @param id The ID of the book to delete.
   * @returns The deleted book object.
   */
  async deleteBook(id: number) {
    const book = await this.bookRepo.delete(id);
    if (!book) throw new NotFound("This book doesn't exist");
    return book;
  }
  withTransaction(prisma: PrismaClient) {
    return new BookService(new BookRepository(prisma));
  }
}
