// src/controllers/book.controller.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BookService } from '../../services/book.service';
import {
  BookParams,
  CreateBookDto,
  GetBookQuery,
} from '../../schemas/book.schema';

export class BookController {
  constructor(private bookService: BookService) {}

  async addBook(
    req: Request<unknown, unknown, CreateBookDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bookData = req.body;
      const newBook = await this.bookService.createBook(bookData);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Book has been added successfully!',
        data: newBook,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateBook(
    req: Request<any, unknown, CreateBookDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id }: BookParams = req.params;
      const bookData = req.body;
      const updatedBook = await this.bookService.updateBook(
        Number(id),
        bookData
      );
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Book has been updated successfully!',
        data: updatedBook,
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteBook(req: Request<any>, res: Response, next: NextFunction) {
    try {
      const { id }: BookParams = req.params;
      const deletedBook = await this.bookService.deleteBook(Number(id));
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Book has been deleted successfully!',
        data: deletedBook,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllBooks(
    req: Request<unknown, unknown, unknown, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { search }: GetBookQuery = req.query;
      const books = await this.bookService.findAllBooks(search);
      res.status(StatusCodes.OK).json({
        success: true,
        data: books,
      });
    } catch (err) {
      return next(err);
    }
  }
}
