/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOption } from '../../../interfaces/pagenation';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';

const createBook = async (payload: IBook): Promise<IBook> => {
  return await Book.create(payload);
};

const getAllBook = async (
  filters: IBookFilters,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  const andConditionss = [
    // it's for searching
    {
      $or: [
        {
          title: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          gene: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ],
    },
    // it's for filtering
    {
      $and:[
        {
          genre: filtersData.genre,
        },
        {
          publicationDate: filtersData.publicationDate,
        }
      ]
    }
  
  ];

  console.log("searchTearm",searchTerm,"filterData",filtersData);
  
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  

  // it's for filtering
  // if (Object.keys(filtersData).length) {
  //   andConditions.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: value,
  //     })),
  //   });
  // }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'publicationDate') {
          const year = value.substring(0, 4);
          return {
            $expr: {
              $eq: [{ $substr: ['$publicationDate', 0, 4] }, year],
            },
          };
        } else {
          return {
            [field]: value,
          };
        }
      }),
    });
  }
  





  const { page, limit, skype, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  // it's for shorting
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const count = await Book.countDocuments(whereCondition);

  if (page) {
    if (skype > count) throw Error('This page does not exist');
  }

  const result = await Book.find(whereCondition)
    .sort(sortCondition)
    .skip(skype)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};

// const getSingleBook = async (
//   BookId: string
// ): Promise<IBook | null> => {
//   return await Book.findById(BookId)
//     .populate('academicDepartment')
//     .populate('academicBook');
// };

// const updateBook = async (
//   BookId: string,
//   payload: Partial<IBook>
// ): Promise<IBook | null> => {
//   const isExist = await Book.findOne({ id: BookId });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
//   }

//   const { name, ...BookData } = payload;

//   const updatedBookData: Partial<IBook> = { ...BookData };

//   // console.log(guardian, localGuardian);

//   // dynamically updating name
//   if (name && Object.keys(name).length > 0) {
//     Object.keys(name).forEach(key => {
//       const nameKey = `name.${key}`;
//       (updatedBookData as any)[nameKey] = name[key as keyof typeof name];
//     });
//   }

//   return await Book.findOneAndUpdate({ id: BookId }, updatedBookData, {
//     new: true,
//   });
// };

// const deleteBook = async (BookId: string): Promise<IBook | null> => {
//   const Book = await Book.findByIdAndDelete(BookId)
//     .populate('academicDepartment')
//     .populate('academicBook');

//   (await User.findOneAndDelete({ id: Book?.id })) as IStudent;

//   return Book;
// };

export const BookService = {
  createBook,
  getAllBook,
  // getSingleBook,
  // updateBook,
  // deleteBook,
};
// http://localhost:5000/api/v1/books?pae=1&limit=2&sortBy=title&sortOrder=desc

// -07-31T00:00:00.000Z