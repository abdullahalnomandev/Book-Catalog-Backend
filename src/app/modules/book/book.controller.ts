import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constant';
import { BookService } from './book.service';



const createBook = catchAsync(async (req: Request, res: Response) => {
  
  const result = await BookService.createBook(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    data: result,
  });
});



const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOption = pick(req.query, paginationFields);
  
  const result = await BookService.getAllBook(filters, paginationOption);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getSingleBook(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    data: result,
  });
  // next();
});

// const updateBook = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const data = req.body;
//   const result = await BookService.updateBook(id, data);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     status: 'success',
//     data: result,
//   });
// });

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.deleteBook(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    data: result,
  });
});
export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  // updateBook,
  deleteBook
};
