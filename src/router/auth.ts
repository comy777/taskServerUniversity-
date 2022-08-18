import { Router } from "express";
import { check } from "express-validator";
import {
  login,
  register,
  setProfile,
  getUser,
  validateEmail,
} from "../controllers/auth";
import { validateToken, validateTokenCheck } from "../jwt/jwt";
import { validate } from "../middlewares/validate";
import {
  userVerify,
  verifyEmail,
  resetPassword,
  forgetPassword,
} from "../controllers/auth";

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

authRouter.get(
  "/validate-email/:token",
  [check("token", "Token requerido").notEmpty(), validateTokenCheck],
  validateEmail
);

authRouter.get(
  "/user-verify/:token",
  [check("token", "Token requerido").notEmpty(), validateTokenCheck],
  userVerify
);

authRouter.get("/", [validateToken], getUser);

authRouter.put("/", [validateToken], setProfile);

authRouter.post(
  "/verify-email",
  [
    check("email", "Correo electronico requerido").notEmpty(),
    check("email", "Correo electronico no valido").isEmail(),
    validate,
  ],
  verifyEmail
);

authRouter.post(
  "/forget-password",
  [
    check("email", "Correo electronico requerido").notEmpty(),
    check("email", "Correo electronico no valido").isEmail(),
    validate,
  ],
  forgetPassword
);

authRouter.get(
  "/reset-password/:token",
  [
    check("token", "Token requerido"),
    validateTokenCheck,
    check("password", "La contraseña es requerida").notEmpty(),
    check("password", "La contraseña debe tener mas de 8 caracteres").isLength({
      min: 8,
    }),
    check("newPassword", "La contraseña nueva es requerida").notEmpty(),
    check(
      "newPassword",
      "La contraseña debe tener mas de 8 caracteres"
    ).isLength({ min: 8 }),
    validate,
  ],
  resetPassword
);

export default authRouter;
