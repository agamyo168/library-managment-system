// src/controllers/book.controller.ts
import { NextFunction, Request, Response } from 'express';
import { BorrowingService } from '../../services/borrowing.service';
import { BorrowingDto } from '../../schemas/borrowing.schema';
import { StatusCodes } from 'http-status-codes';

export class BorrowingController {
  constructor(private borrowingService: BorrowingService) {}
  public checkout = async (
    req: Request<any, unknown, BorrowingDto>,
    res: Response
  ) => {
    const { bookId } = req.body;
    const {
      payload: { id: borrowerId },
    } = res.locals;

    const data = {
      bookId: +bookId,
      borrowerId: +borrowerId,
    };

    await this.borrowingService.checkout(data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book was borrowed successfully!',
    });
  };

  public return = async (
    req: Request<any, unknown, BorrowingDto>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await this.borrowingService.returnBook(+id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book was returned successfully!',
    });
  };

  public getAllBorrowedBooksAndBorrowers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { status, page = 1 } = req.query as any;
    const query = { status };
    const data = await this.borrowingService.getAllBorrowedBooksAndBorrowers(
      query,
      +page
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Borrowed books list was fetched successfully!',
      data,
    });
  };

  public getMyBorrowedBooks = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const { page } = req.query as any;
    const { id }: { id: number } = res.locals.payload;
    const data = await this.borrowingService.getMyBorrowedBooks(+id, +page);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Borrowed books list was fetched successfully!',
      data,
    });
  };
}
