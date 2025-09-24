import { BorrowingRepository } from '../repositories/borrowing.repository';
import { PrismaClient } from '../generated/prisma';
import { BookService } from './book.service';
import { BookRepository } from '../repositories/book.repository';
import BadRequestError from '../errors/custom/bad.request.error.class';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
import ConflictError from '../errors/custom/conflict.error.class';
import PrismaErrorCodes from '../constants/prisma-errors.constants';
import { CheckoutParam } from '../schemas/borrowing.schema';
import NotFound from '../errors/custom/notfound.error.class';

export class BorrowingService {
  constructor(
    private borrowingRepo: BorrowingRepository,
    private prisma: PrismaClient //Just to use transaction in prisma
  ) {}

  async checkout(data: CheckoutParam) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bookServiceTx = new BookService(new BookRepository(tx));
        const borrowingRepoTx = new BorrowingRepository(tx);
        const { bookId, borrowerId } = data;
        const book = await bookServiceTx.findBookById(+bookId);
        if (book.quantity < 1)
          throw new BadRequestError('No available books to borrow');

        await bookServiceTx.changeBookQuantity(bookId, -1);
        const oldBorrowings =
          await borrowingRepoTx.fetchBorrowingByBorrowerIdAndBookId(
            borrowerId,
            bookId
          );
        if (oldBorrowings)
          throw new ConflictError('You already borrowed this book');
        await borrowingRepoTx.checkoutBook(data);
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaErrorCodes.UNIQUE
      )
        err = new ConflictError('You already borrowed this book');
      throw err;
    }
  }
  async returnBook(borrowingId: number, borrowerId: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bookServiceTx = new BookService(new BookRepository(tx));
        const borrowingRepoTx = new BorrowingRepository(tx);
        const { count } = await borrowingRepoTx.returnBook(
          borrowingId,
          borrowerId //-> I pass this as a security check
        );
        if (!count)
          throw new NotFound(
            'Book has already been returned or never borrowed'
          );
        const borrowing = await borrowingRepoTx.fetchBorrowingById(borrowingId);
        if (!borrowing) throw new NotFound('');
        await bookServiceTx.changeBookQuantity(borrowing.bookId, 1);
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaErrorCodes.UNIQUE
      )
        err = new ConflictError('You already borrowed this book');
      throw err;
    }
  }

  async fetchAllBorrowedBooks() {
    return this.borrowingRepo.fetchAllBorrowedBooks();
  }
  async fetchUserBorrowedBooks(userId: number) {
    return this.borrowingRepo.fetchUserBorrowedBooks(userId);
  }
}
