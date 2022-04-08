import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../interfaces/interfaces";
import UserSchema from "../models/User";

export const generateToken = (user: User) => {
  const payload = { id: user._id, email: user.email };
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const token = req.headers["authorization"];
  if (!token) return res.send({ error: "Token requerido" });
  try {
    const data: any = jwt.verify(token, process.env.SECRET_KEY);
    const { id } = data;
    const user = await UserSchema.findById(id);
    if (!user.state)
      return res.send({ error: "El usuario no esta registrado" });
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
