"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_constant_1 = require("./book.constant");
const book_model_1 = require("./book.model");
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('createBook', payload);
    return yield book_model_1.Book.create(payload);
});
const getAllBook = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // const andConditionss = [
    //   // it's for searching
    //   {
    //     $or: [
    //       {
    //         title: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //       {
    //         gene: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //     ],
    //   },
    //   // it's for filtering
    //   {
    //     $and:[
    //       {
    //         genre: filtersData.genre,
    //       },
    //       {
    //         publicationDate: filtersData.publicationDate,
    //       }
    //     ]
    //   }
    // ];
    console.log('searchTearm', searchTerm, 'filterData', filtersData);
    if (searchTerm) {
        andConditions.push({
            $or: book_constant_1.bookSearchableFields.map(field => ({
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
                }
                else {
                    return {
                        [field]: value,
                    };
                }
            }),
        });
    }
    const { page, limit, skype, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    // it's for shorting
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const count = yield book_model_1.Book.countDocuments(whereCondition);
    if (page) {
        if (skype > count)
            throw Error('This page does not exist');
    }
    const result = yield book_model_1.Book.find(whereCondition)
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
});
const getSingleBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findById(bookId);
});
const updateBook = (BookId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield book_model_1.Book.findById(BookId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    const BookData = __rest(payload, []);
    const updatedBookData = Object.assign({}, BookData);
    return yield book_model_1.Book.findOneAndUpdate({ _id: BookId }, updatedBookData, {
        new: true,
    });
});
const deleteBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findByIdAndDelete(bookId);
});
const addReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield book_model_1.Book.updateOne({ _id: id }, {
        $push: { reviews: payload },
    });
});
exports.BookService = {
    createBook,
    getAllBook,
    getSingleBook,
    updateBook,
    deleteBook,
    addReview,
};
// http://localhost:5000/api/v1/books?pae=1&limit=2&sortBy=title&sortOrder=desc
// -07-31T00:00:00.000Z
