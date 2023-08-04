import { Model } from "mongoose";

export type IBook = {
  title: string;
  username: string;
  author: string;
  genre: string;
  publicationDate: Date;
  reviews: [
    {
      name: string;
      review: string;
    }
  ];
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationDate?: string;
};
