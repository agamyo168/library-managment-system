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
  //fetches all borrowed books and not returned yet
  async fetchAllBorrowedBooks() {
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
  withTransaction(prisma: PrismaClient) {
    return new BorrowingRepository(prisma);
  }
}
