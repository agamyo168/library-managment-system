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
import logger from '../helpers/logger';

export class BorrowingService {
  constructor(
    private borrowingRepo: BorrowingRepository,
    private prisma: PrismaClient //Just to use transaction in prisma
  ) {}

  async checkout(data: CheckoutParam) {
    await this.prisma.$transaction(async (tx) => {
      const bookServiceTx = new BookService(new BookRepository(tx));
      const borrowingRepoTx = new BorrowingRepository(tx);
      const { bookId, borrowerId } = data;
      const book = await bookServiceTx.findBookById(+bookId);
      if (book.quantity < 1)
        throw new BadRequestError('No available books to borrow');

      await bookServiceTx.changeBookQuantity(bookId, -1);
      const oldBorrowings =
        await borrowingRepoTx.fetchCurrentBorrowingByBorrowerIdAndBookId(
          borrowerId,
          bookId
        );
      logger.info({ name: BorrowingService.name, oldBorrowings });
      if (oldBorrowings.length > 0)
        throw new ConflictError(
          'You already are currently borrowing this book'
        );
      await borrowingRepoTx.checkoutBook(data);
    });
  }
  async returnBook(bookId: number, borrowerId: number) {
    await this.prisma.$transaction(async (tx) => {
      const bookServiceTx = new BookService(new BookRepository(tx));
      const borrowingRepoTx = new BorrowingRepository(tx);
      const { count } = await borrowingRepoTx.returnBook(
        bookId,
        borrowerId //-> I pass this as a security check
      );
      if (!count)
        throw new NotFound('Book has already been returned or never borrowed');
      await bookServiceTx.changeBookQuantity(bookId, 1);
    });
  }

  async fetchAllBorrowedBooks() {
    const borrowings = await this.borrowingRepo.fetchAllBorrowedBooks();
    //Could be done in SQL I guess but this is just ok
    return borrowings.map((borrowing) => ({
      ...borrowing.book,
      borrowedBy: {
        name: borrowing.borrower.name,
        email: borrowing.borrower.email,
      },
    }));
  }
  async fetchUserBorrowedBooks(userId: number) {
    const borrowings = await this.borrowingRepo.fetchUserBorrowedBooks(userId);
    return borrowings.map((borrowing) => ({
      ...borrowing.book,
      dueDate: borrowing.dueDate,
    }));
  }
  async fetchDueDateBorrowedBooks() {
    const borrowings = await this.borrowingRepo.fetchBorrowerPastDueDates();
    //Could refactor these maps later
    return borrowings.map((borrowing) => ({
      ...borrowing.book,
      dueDate: borrowing.dueDate,
    }));
  }
}
