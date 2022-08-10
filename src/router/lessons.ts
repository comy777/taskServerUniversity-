import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import {
  getLessons,
  saveLesson,
  editLesson,
  deleteLesson,
} from "../controllers/lessons";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";

const lessonsRouter = Router();

lessonsRouter.get("/", [validateToken], getLessons);

lessonsRouter.post(
  "/",
  [
    validateToken,
    check("lesson", "Nombre de la clase requerdido").notEmpty(),
    check("schedlue", "El horario es requerido").notEmpty(),
    validate,
  ],
  saveLesson
);

lessonsRouter.put(
  "/:id",
  [
    validateToken,
    check("id", "No es un id valido").isMongoId(),
    check("id", "El id es requerido").notEmpty(),
    validate,
  ],
  editLesson
);

lessonsRouter.delete(
  "/:id",
  [
    validateToken,
    check("id", "No es un id valido").isMongoId(),
    check("id", "El id es requerido").notEmpty(),
    validate,
  ],
  deleteLesson
);

export default lessonsRouter;
