// src/controllers/user.controller.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class BookController {
  constructor() {}

  //Weirdly enough this should be an admin endpoint
  async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      //Get book body
      const {} = req.body;
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Book has been added successfully!',
      });
    } catch (err) {
      return next(err);
    }
  }
  async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const {} = req.body;
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Book has been updated successfully!',
      });
    } catch (err) {
      return next(err);
    }
  }
  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const {} = req.body;
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Book has been deleted successfully!',
      });
    } catch (err) {
      return next(err);
    }
  }
  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const {} = req.body;
      //should also get query params search: title, author, isbn
      res.status(StatusCodes.OK).json({
        success: true,
        data: [],
      });
    } catch (err) {
      return next(err);
    }
  }
}
