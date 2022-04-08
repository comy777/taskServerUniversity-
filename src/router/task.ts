import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";
import { getTasks, saveTask, editTask, deleteTask } from "../controllers/task";

const taskRouter = Router();

taskRouter.get(
  "/:id",
  [validateToken, check("id", "Id no valido").isMongoId(), validate],
  getTasks
);

taskRouter.post(
  "/:id",
  [validateToken, check("id", "No es un id valido").isMongoId(), validate],
  saveTask
);

taskRouter.put(
  "/:id",
  [validateToken, check("id", "No es un id valido").isMongoId(), validate],
  editTask
);

taskRouter.delete(
  "/:id",
  [validateToken, check("id", "No es un id valido").isMongoId(), validate],
  deleteTask
);

export default taskRouter;
