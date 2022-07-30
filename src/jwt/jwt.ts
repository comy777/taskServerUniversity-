import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../interfaces/interfaces";
import UserSchema from "../models/User";

export const generateToken = (user: User): string => {
  const payload = { id: user._id, email: user.email };
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: Function,
  dataToken?: string
) => {
  const token = req.headers["authorization"];
  if (!token) return res.send({ error: "Token requerido" });
  try {
    const data: any = dataToken
      ? jwt.verify(dataToken, process.env.SECRET_KEY)
      : jwt.verify(token, process.env.SECRET_KEY);
    console.log(data);
    const { id } = data;
    const user = await UserSchema.findById(id);
    if (!user.state)
      return res.send({ error: "El usuario no esta registrado" });
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    const dataToken = refreshToken(token);
    validateToken(req, res, next, dataToken);
    return res.send({ error: "Refrescar token" });
  }
};

export const refreshToken = (token: string) => {
  try {
    const userToken: any = jwt.decode(token);
    const dataToken: string = generateToken(userToken);
    return dataToken;
  } catch (error) {
    console.log(error);
  }
};
