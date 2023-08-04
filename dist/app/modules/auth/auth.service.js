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
exports.AuthService = void 0;
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../users/user.model");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: loginPassworde } = payload;
    const isUserExist = yield user_model_1.User.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'this email is not correct');
    }
    const user = yield user_model_1.User.findOne({ email }, { password: +1, email: 1, username: 1 });
    const isPasswordMatch = yield user_model_1.User.isPasswordMatch(loginPassworde, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'your password is not correct.');
    }
    return {
        name: isUserExist.name,
        email: isUserExist.email,
        username: isUserExist.username
    };
});
const signUpUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = userData;
    const isUserExist = yield user_model_1.User.isUserExist(email);
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'this email is already registered');
    }
    const isUsernameExist = yield user_model_1.User.findOne({ username });
    if (isUsernameExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'This username is already used.');
    }
    const newUser = yield user_model_1.User.create(userData);
    const _a = newUser.toObject(), { password } = _a, others = __rest(_a, ["password"]);
    return others;
});
exports.AuthService = {
    loginUser,
    signUpUser,
};
