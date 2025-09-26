import { Prisma, PrismaClient } from '../generated/prisma';
import logger from '../helpers/logger';
import { CheckoutParam } from '../schemas/borrowing.schema';
import { PrismaTx } from '../types';
export class BorrowingRepository {
  constructor(private prisma: PrismaClient | PrismaTx) {}

  async checkoutBook(data: CheckoutParam) {
    const { borrowerId, bookId } = data;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // CONSTANT because if we were to allow user input they would put indefinite time -> Maybe make an ENUM with options?
    return this.prisma.borrowingProcess.create({
      data: {
        borrowerId,
        bookId,
        dueDate,
      },
    });
  }
  async returnBook(borrowingId: number) {
    return this.prisma.borrowingProcess.update({
      where: { id: borrowingId, returnDate: null },
      data: { returnDate: new Date() },
    });
  }

  async findAllBorrowedBooksIncludeBorrowers(
    query: { status?: 'OVERDUE' },
    page: number = 1,
    limit: number = 10
  ) {
    let whereOptions: any = {};
    const { status } = query;
    if (status === 'OVERDUE') {
      whereOptions.dueDate = { lte: new Date() };
    }

    return this.prisma.borrowingProcess.findMany({
      include: { book: true, borrower: true },
      where: { returnDate: null, ...whereOptions },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findBorrowedBooksByBorrowerId(
    borrowerId: number,
    page: number = 1,
    limit: number = 10
  ) {
    return this.prisma.borrowingProcess.findMany({
      where: { borrowerId, returnDate: null },
      include: { book: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  async fetchBorrowerPastDueDates() {
    return this.prisma.borrowingProcess.findMany({
      where: { returnDate: null, dueDate: { lte: new Date() } },
      include: { book: true, borrower: true },
    });
  }
  async findBorrowingCountReports(fromDate?: string, toDate?: string) {
    const whereClauses: Prisma.Sql[] = [];
    if (fromDate) {
      whereClauses.push(Prisma.sql`bp.created_at >= ${new Date(fromDate)}`);
    }
    if (toDate)
      whereClauses.push(Prisma.sql`bp.created_at <= ${new Date(toDate)}`);

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    logger.info(where);
    const data = await this.prisma.$queryRaw<
      { count_borrows: bigint; return_count: bigint; overdue_counts: bigint }[]
    >`
    SELECT COUNT(id) AS count_borrows,COUNT(return_date) AS return_count, SUM(CASE WHEN due_date < COALESCE(return_date, NOW()) THEN 1 ELSE 0 END) AS overdue_counts
    FROM borrowing_process bp
    ${where};
    `;
    return {
      borrows: Number(data[0].count_borrows),
      returns: Number(data[0].return_count),
      overDueCount: Number(data[0].overdue_counts),
    };
  }

  async findCurrentBorrowingByBorrowerIdAndBookId(
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
