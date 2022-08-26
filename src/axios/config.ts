import axios from "axios";
import Token from "../models/Token";

const baseURL = "https://api.flaticon.com/v3/";

export const appFaticonApi = axios.create({
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
