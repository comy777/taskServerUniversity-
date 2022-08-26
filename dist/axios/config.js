"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appFaticonApi = void 0;
const axios_1 = __importDefault(require("axios"));
const baseURL = "https://api.flaticon.com/v3/";
exports.appFaticonApi = axios_1.default.create({
    baseURL,
});
// appFaticonApi.interceptors.request.use(async (config) => {
//   const tokenData = await Token.find();
//   if (tokenData.length > 0) {
//     const { token } = tokenData[0];
//     config.headers["authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });
