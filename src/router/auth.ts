import { Router } from "express";
import { check } from "express-validator";
import { login, register, setProfile, getUser } from "../controllers/auth";
import { validateToken } from "../jwt/jwt";
import { validate } from "../middlewares/validate";

const authRouter = Router();

authRouter.post(
  "/",
  [
    check("email", "Correo electronico requerido").notEmpty(),
    check("email", "Correo electronico no valido").isEmail(),
    check("password", "contraseña requerida").notEmpty(),
    validate,
  ],
  login
);

authRouter.post(
  "/register",
  [
    check("email", "Correo electronico requerido").notEmpty(),
    check("email", "Correo electronico no valido").isEmail(),
    check("password", "contraseña requerida"),
    check("password", "La contraseña debe tener mas de 8 caracteres").isLength({
      min: 8,
    }),
    validate,
  ],
  register
);

authRouter.get("/", [validateToken], getUser);

authRouter.put("/", [validateToken], setProfile);

export default authRouter;
