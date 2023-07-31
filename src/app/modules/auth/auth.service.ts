import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
const loginUser = async (payload: IUser): Promise<IUser | null> => {

  const {email ,password} = payload;

  const isEmailExist = await User.isEmailExist(email);
  if (!isEmailExist) {
    throw new ApiError(httpStatus.CONFLICT, 'this email is not correct');
  }

  const user = await User.findOne({email});
  const isPasswordMatch = await User.isPasswordMatch(password, user?.password as string);

  if(!isPasswordMatch){
    throw new ApiError(httpStatus.CONFLICT, 'your password is not correct.');
  }

  return user;
};

const signUpUser = async (userData: IUser): Promise<Partial<IUser | null>> => {
  const { email, username } = userData;
  
  console.log('email', email,username);
  

  const isEmailExist = await User.isEmailExist(email)
  const isUsernameExist = await User.isUsernameExist(username);

  if (isEmailExist) {
    throw new ApiError(httpStatus.CONFLICT, 'this user is already registered');
  }
  if (isUsernameExist) {
    throw new ApiError(httpStatus.CONFLICT, 'this username is already used.');
  }

  const newUser = await User.create(userData);
  const { password, ...others } = newUser.toObject();

  return others;
};

export const AuthService = {
  loginUser,
  signUpUser,
};
