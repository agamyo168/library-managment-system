import { BorrowingRepository } from '../repositories/borrowing.repository';
import logger from '../helpers/logger';
import { PrismaClient } from '../generated/prisma';
import { BookService } from './book.service';
import { BookRepository } from '../repositories/book.repository';
import BadRequestError from '../errors/custom/bad.request.error.class';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import ConflictError from '../errors/custom/conflict.error.class';
import PrismaErrorCodes from '../constants/prisma-errors.constants';

export class BorrowingService {
  constructor(
    private borrowingRepo: BorrowingRepository,
    private prisma: PrismaClient //Just to use transaction in prisma
  ) {}

  async checkout(data: { borrowerId: number; bookId: number }) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bookServiceTx = new BookService(new BookRepository(tx));
        const borrowingRepoTx = new BorrowingRepository(tx);
        const { bookId, borrowerId } = data;
        const book = await bookServiceTx.findBookById(+bookId);
        if (book.quantity < 1)
          throw new BadRequestError('No available books to borrow');

        await bookServiceTx.updateBook(book.id, {
          ...book,
          quantity: book.quantity - 1,
        });

        await borrowingRepoTx.checkoutBook({
          bookId: +bookId,
          borrowerId: +borrowerId,
        });
      });
    } catch (err) {
      logger.error(err);
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaErrorCodes.UNIQUE
      )
        err = new ConflictError('You already borrowed this book');
      throw err;
    }
  }
}
