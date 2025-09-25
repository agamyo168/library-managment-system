// src/controllers/book.controller.ts
import { NextFunction, Request, Response } from 'express';
import { BorrowingService } from '../../services/borrowing.service';
import { CheckoutParam } from '../../schemas/borrowing.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';

export class BorrowingController {
  constructor(private borrowingService: BorrowingService) {}
  public checkout = async (req: Request<any>, res: Response) => {
    const data: CheckoutParam = req.params;
    const {
      payload: { id: userId },
    } = res.locals;
    data.borrowerId = +userId;
    data.bookId = +data.bookId;
    await this.borrowingService.checkout(data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book was borrowed successfully!',
    });
  };
  public return = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const { id }: { id: number } = req.params;
    const {
      payload: { id: userId },
    } = res.locals;
    await this.borrowingService.returnBook(+id, +userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book was returned successfully!',
    });
  };
  public fetchAllBorrowedBooksAndBorrowers = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.borrowingService.fetchAllBorrowedBooks();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Borrowed books list was fetched successfully!',
      data,
    });
  };
  public fetchMyBorrowedBooks = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const { id }: { id: number } = res.locals.payload;
    const data = await this.borrowingService.fetchUserBorrowedBooks(+id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Borrowed books list was fetched successfully!',
      data,
    });
  };
  public fetchPastDueDateBooks = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.borrowingService.fetchDueDateBorrowedBooks();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Due date borrowed books list was fetched successfully!',
      data,
    });
  };
}
