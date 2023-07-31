import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';

export const bookSchema = new Schema<IBook, BookModel>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    author: {
      type: String,
      required: [true, 'author is required'],
    },
    genre: {
      type: String,
      required: [true, 'genre is required'],
    },
    publicationDate: {
      type: Date,
      required: [true, 'Date is required'],
    },
    reviews: [
      {
        name: {
          type: String,
          require: true,
        },
        review: {
          type: String,
          require: true,
        },
      },
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>('Book', bookSchema);
