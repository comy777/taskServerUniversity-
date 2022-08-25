import { Router } from "express";
import {
  getMeets,
  saveMeet,
  updateMeet,
  deleteMeet,
} from "../controllers/meet";
import { validateToken } from "../jwt/jwt";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";

const meetRouter = Router();

meetRouter.get("/", [validateToken], getMeets);

meetRouter.post(
  "/",
  [
    validateToken,
    check("meet", "El nombre de la reunion es requerido").notEmpty(),
    check("date_meet", "La fecha es requerido").notEmpty(),
    check("date_meet", "No es formato fecha").isDate(),
    check("start_time", "La hora es requerido").notEmpty(),
    validate,
  ],
  saveMeet
);

meetRouter.put(
  "/:id",
  [
    validateToken,
    check("id", "El id de la reunion es requerido"),
    check("id", "No es un mongo id valido").isMongoId(),
    validate,
  ],
  updateMeet
);

meetRouter.delete(
  "/:id",
  [
    validateToken,
    check("id", "El id de la reunion es requerido"),
    check("id", "No es un mongo id valido").isMongoId(),
    validate,
  ],
  deleteMeet
);

export default meetRouter;
