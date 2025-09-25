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

  public addBook = async (
    req: Request<unknown, unknown, CreateBookDto>,
    res: Response,
    next: NextFunction
  ) => {
    const bookData = req.body;
    const newBook = await this.bookService.createBook(bookData);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Book has been added successfully!',
      data: newBook,
    });
  };

  public updateBook = async (
    req: Request<any, unknown, CreateBookDto>,
    res: Response,
    next: NextFunction
  ) => {
    const { id }: BookParams = req.params;
    const bookData = req.body;
    const updatedBook = await this.bookService.updateBook(Number(id), bookData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book has been updated successfully!',
      data: updatedBook,
    });
  };

  public deleteBook = async (
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) => {
    const { id }: BookParams = req.params;
    const deletedBook = await this.bookService.deleteBook(Number(id));
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Book has been deleted successfully!',
      data: deletedBook,
    });
  };

  public getAllBooks = async (
    req: Request<unknown, unknown, unknown, any>,
    res: Response,
    next: NextFunction
  ) => {
    const { search }: GetBookQuery = req.query;
    const books = await this.bookService.findAllBooks(search);
    res.status(StatusCodes.OK).json({
      success: true,
      data: books,
    });
  };
}
