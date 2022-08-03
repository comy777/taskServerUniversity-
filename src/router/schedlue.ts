import { Router } from "express";
import { check } from "express-validator";
import {
  getSchedlue,
  updateSchedlue,
  deleteSchedlue,
  saveSchedlue,
} from "../controllers/schedlue";
import { validateToken } from "../jwt/jwt";
import { validate, validateDay } from "../middlewares/validate";

const schedlueRouter = Router();

schedlueRouter.get("/", [validateToken], getSchedlue);

schedlueRouter.post(
  "/",
  [
    validateToken,
    check("day", "El dia es requerido").notEmpty(),
    check("day").custom(validateDay),
    check("schedlue", "El horario es requerido").notEmpty(),
    validate,
  ],
  saveSchedlue
);

schedlueRouter.put(
  "/:id",
  [validateToken, check("id", "Id no valido").isMongoId(), validate],
  updateSchedlue
);

schedlueRouter.delete(
  "/:id",
  [validateToken, check("id", "Id no valido").isMongoId(), validate],
  deleteSchedlue
);

export default schedlueRouter;
