// src/controllers/book.controller.ts
import { NextFunction, Request, Response } from 'express';
import { BorrowingService } from '../../services/borrowing.service';
import { CheckoutParam } from '../../schemas/borrowing.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';

export class BorrowingController {
  constructor(private borrowingService: BorrowingService) {}
  async checkout(req: Request<any>, res: Response, next: NextFunction) {
    try {
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
    } catch (err) {
      return next(err);
    }
  }
  async return(req: Request<any>, res: Response, next: NextFunction) {
    try {
      const { id }: { id: number } = req.params;
      const {
        payload: { id: userId },
      } = res.locals;
      await this.borrowingService.returnBook(+id, +userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Book was returned successfully!',
      });
    } catch (err) {
      return next(err);
    }
  }
}
