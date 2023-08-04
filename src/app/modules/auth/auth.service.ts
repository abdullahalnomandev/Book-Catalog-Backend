/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
const loginUser = async (payload: IUser): Promise<Partial<IUser | null>> => {
    
  const { email, password:loginPassworde } = payload;
  
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.CONFLICT, 'this email is not correct');
  }

  const user = await User.findOne({ email },{password:+1,email:1,username:1});  
  const isPasswordMatch = await User.isPasswordMatch( loginPassworde, user?.password as string);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.CONFLICT, 'your password is not correct.');
  }

  return {
    name:isUserExist.name,
    email:isUserExist.email,
    username:isUserExist.username
  };
};

const signUpUser = async (userData: IUser): Promise<Partial<IUser | null>> => {
  const { email, username } = userData;

  const isUserExist = await User.isUserExist(email) as IUser;

  if (isUserExist) {
    throw new ApiError(httpStatus.CONFLICT, 'this email is already registered');
  }
  const isUsernameExist = await User.findOne({username});
  if (isUsernameExist) {
    throw new ApiError(httpStatus.CONFLICT, 'This username is already used.');
  }

  const newUser = await User.create(userData);
  const { password, ...others } = newUser.toObject();

  return others;
};

export const AuthService = {
  loginUser,
  signUpUser,
};
