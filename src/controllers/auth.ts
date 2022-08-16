import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { User as UserInterface } from "../interfaces/interfaces";
import { generateToken, validateTokenAuth } from "../jwt/jwt";
import { deleteImage } from "../utils/upload";
import { sendVerification } from "../config/mailer";

const tokenUser = async (user: UserInterface, email: string, res: Response) => {
  let expiresIn = "7d";
  let token = "";
  if (!user.verify) {
    token = generateToken(user, "10m");
    await sendVerification(email, token);
    return res.send({ msg: "Validar el correo electronico" });
  }
  if (user.verify) token = generateToken(user, expiresIn);
  return res.send({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.send({ error: "El usuario no se encuentra registrado" });
  const validatePassword = bcrypt.compareSync(password, user.password);
  if (!validatePassword)
    return res.send({ error: "El correo y la contraseña no coinciden" });
  //Token
  await tokenUser(user, email, res);
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
    await tokenUser(user, email, res);
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.user;
  console.log(id);
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

export const validateEmail = async (req: Request, resp: Response) => {
  const { token } = req.params;
  const email = validateTokenAuth(token);
  if (!email) return resp.send({ error: "Token expired" });
  const user = await User.findOne({ email });
  if (!user) return resp.send({ error: "Usuario no registrado" });
  if (user.verify) return resp.redirect("/validate-email.html");
  try {
    await User.findByIdAndUpdate(user._id, { verify: true });
    return resp.redirect("/user-verify.html");
  } catch (error) {
    console.log(error);
    return resp.send({ error: "Error del servidor" });
  }
};
