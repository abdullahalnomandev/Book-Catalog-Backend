/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type IUser = {
  name: string;
  email: string;
  username: string;
  password: string;
}

export type UserModel = Model<IUser> & {
  isPasswordMatch(givenPassword: string, savedPassword: string): Promise<boolean>;
  isEmailExist(email: string): Promise<Partial<IUser | null>>;
  isUsernameExist(username: string): Promise<Partial<Pick<IUser, 'username'>>>;
}
