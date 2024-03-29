import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User as UserInterface } from "../interfaces/interfaces";
import User from "../models/User";
import UserSchema from "../models/User";

export const generateToken = (
  user: UserInterface,
  expiresIn: string
): string => {
  const payload = { id: user._id, email: user.email };
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn,
    });
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const token = req.headers["authorization"];
  if (!token) return res.send({ error: "Token requerido" });
  const dataToken = await refreshToken(token);
  try {
    const data: any = jwt.verify(dataToken, process.env.SECRET_KEY);
    const { id } = data;
    const user = await UserSchema.findById(id);
    if (!user.state)
      return res.send({ error: "El usuario no esta registrado" });
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.send({ error: "Refrescar token" });
  }
};

export const refreshToken = async (token: string) => {
  const userToken: any = jwt.decode(token);
  const { id } = userToken;
  const user = await User.findById(id);
  if (!user) return "Error";
  const dataToken: string = generateToken(user, "7d");
  return dataToken;
};

export const validateTokenAuth = (token: string): any => {
  try {
    const payload: any = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = payload;
    return email;
  } catch (error) {
    return null;
  }
};

export const validateTokenCheck = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { token } = req.params;
  if (!token) return res.send({ error: "Token requerido" });
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    return res.send({ error: "Token no valido" });
  }
};
