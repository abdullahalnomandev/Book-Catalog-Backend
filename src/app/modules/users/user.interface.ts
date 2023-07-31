/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type UserModel = Model<IUser> & {
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;

  isUserExist(  email: string): Promise<IUser | null>;
};
