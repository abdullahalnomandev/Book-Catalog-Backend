"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const book_route_1 = require("../modules/book/book.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/books',
        route: book_route_1.BookRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
