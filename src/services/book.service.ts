import { BookRepository } from '../repositories/book.repository';
import NotFound from '../errors/custom/notfound.error.class';
import { Prisma, PrismaClient } from '@prisma/client';

export class BookService {
  constructor(private bookRepo: BookRepository) {}

  async createBook(data: Prisma.BookCreateInput) {
    return await this.bookRepo.create(data);
  }

  async findBookById(id: number) {
    const book = await this.bookRepo.findById(id);
    if (!book) throw new NotFound("This book doesn't exist");
    return book;
  }

  async getAllBooks(searchString?: string, page?: number) {
    return this.bookRepo.findAll(searchString, page);
  }

  async updateBook(id: number, data: Partial<Prisma.BookCreateInput>) {
    return await this.bookRepo.update(id, data);
  }

  async changeBookQuantity(id: number, increment: number) {
    return await this.bookRepo.changeBookQuantity(id, increment);
  }

  async deleteBook(id: number) {
    const book = await this.bookRepo.delete(id);
    if (!book) throw new NotFound("This book doesn't exist");
    return book;
  }
  withTransaction(prisma: PrismaClient) {
    return new BookService(new BookRepository(prisma));
  }
}
