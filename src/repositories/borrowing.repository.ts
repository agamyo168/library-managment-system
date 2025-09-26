import { PrismaClient } from '../generated/prisma';
import { CheckoutParam } from '../schemas/borrowing.schema';
import { PrismaTx } from '../types';
export class BorrowingRepository {
  constructor(private prisma: PrismaClient | PrismaTx) {}
  async checkoutBook(data: CheckoutParam) {
    const { borrowerId, bookId } = data;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // CONSTANT because if we were to allow user input they would put indefinite time
    return this.prisma.borrowingProcess.create({
      data: {
        borrowerId,
        bookId,
        dueDate,
        //return date is null by default.
      },
    });
  }
  async returnBook(borrowingId: number) {
    return this.prisma.borrowingProcess.update({
      where: { id: borrowingId, returnDate: null },
      data: { returnDate: new Date() },
    });
  }

  async findAllBorrowedBooks() {
    return this.prisma.borrowingProcess.findMany({
      include: { book: true, borrower: true },
      where: { returnDate: null },
    });
  }

  async fetchUserBorrowedBooks(borrowerId: number) {
    return this.prisma.borrowingProcess.findMany({
      where: { borrowerId, returnDate: null },
      include: { book: true },
    });
  }
  async fetchBorrowerPastDueDates() {
    return this.prisma.borrowingProcess.findMany({
      where: { returnDate: null, dueDate: { lte: new Date() } },
      include: { book: true, borrower: true },
    });
  }
  async fetchBorrowingById(borrwingId: number) {
    return this.prisma.borrowingProcess.findUnique({
      where: { id: borrwingId },
    });
  }
  async fetchCurrentBorrowingByBorrowerIdAndBookId(
    borrowerId: number,
    bookId: number
  ) {
    return this.prisma.borrowingProcess.findMany({
      where: { borrowerId, bookId, returnDate: null },
    });
  }
  withTransaction(prisma: PrismaClient) {
    return new BorrowingRepository(prisma);
  }
}
