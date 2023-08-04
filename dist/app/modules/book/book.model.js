"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.bookSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    username: {
        type: String,
        require: true
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
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Book = (0, mongoose_1.model)('Book', exports.bookSchema);
