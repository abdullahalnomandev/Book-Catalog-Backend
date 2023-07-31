/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';


const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false, // Changed '0' to 'false'
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.isEmailExist = async function (email: string): Promise<Partial<IUser | null>> {
  return await this. model('User').findOne(
    { email },
    { email: 1 }
  ).lean();
};

userSchema.methods.isUsernameExist = async function (username: string): Promise<Partial<Pick<IUser, 'username'>>> {
  return await this.model('User').findOne(
    { username },
    { username: 1 }
  ).lean();
};

userSchema.methods.isPasswordMatch = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword); // Changed 'compareSync' to 'compare'
};

// Hashing password
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  user.password = await bcrypt.hash(user.password, Number(config.bycrypt_salt_rounds));
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
