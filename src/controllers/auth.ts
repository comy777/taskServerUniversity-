import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../jwt/jwt";
import { deleteImage } from "../utils/upload";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.send({ error: "El usuario no se encuentra registrado" });
  const validatePassword = bcrypt.compareSync(password, user.password);
  if (!validatePassword)
    return res.send({ error: "El correo y la contraseña no coinciden" });
  //Token
  const token = generateToken(user);
  return res.send({ token });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.send({ error: "El usuario ya se encuentra registrado" });
  try {
    user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    const token = generateToken(user);
    return res.send({ token });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.user;
  const user = await User.findById(id);
  if (!user) return res.send({ error: "Usuario no registrado" });
  return res.send({ user });
};

export const setProfile = async (req: Request, res: Response) => {
  const id = req.user;
  const userValid = await User.findById(id);
  if (!userValid) return res.send({ error: "Usuario no registrado" });
  const { image } = userValid;
  const { image: imageNew } = req.body;
  if (imageNew) {
    if (image) {
      const idImage = image.split("/");
      let data = idImage[idImage.length - 1];
      data = data.split(".");
      const resp = await deleteImage(data[0]);
      if (!resp) return res.send({ error: "Error del servidor" });
    }
  }
  try {
    const resp = await User.findByIdAndUpdate(id, req.body, { new: true });
    return res.send({ user: resp });
  } catch (error) {
    console.log(error);
  }
};
