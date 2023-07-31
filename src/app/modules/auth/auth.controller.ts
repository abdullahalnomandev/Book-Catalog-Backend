import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'User logged in successfully',
    data: result,
  });
});

const signUpUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const {  ...userData } = req.body;
    const result = await AuthService.signUpUser(userData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      status: 'success',
      message: 'User created successfully.',
      data: result,
    });
  }
);


export const AuthController = {
  loginUser,
  signUpUser
};
