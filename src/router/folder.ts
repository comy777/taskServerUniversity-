import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";
import { getFilesFolder } from "../controllers/folder";
import {
  getFoldersLesson,
  addFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folder";

const folderRouter = Router();

folderRouter.get(
  "/:lesson",
  [
    validateToken,
    check("lesson", "No es un mongo id valido").isMongoId(),
    validate,
  ],
  getFoldersLesson
);

folderRouter.post(
  "/:lesson",
  [
    validateToken,
    check("lesson", "No es un mongo id valido").isMongoId(),
    check("folder", "El nombre de la carpeta es obligatorio").notEmpty(),
    validate,
  ],
  addFolder
);

folderRouter.put(
  "/:id",
  [
    validateToken,
    check("id", "No es un mongo id valido").isMongoId(),
    check("folder", "El nombre de la carpeta es obligatorio").notEmpty(),
    validate,
  ],
  updateFolder
);

folderRouter.delete(
  "/:id",
  [
    validateToken,
    check("id", "No es un mongo id valido").isMongoId(),
    validate,
  ],
  deleteFolder
);

folderRouter.get(
  "/folder/:id",
  [validateToken, check("id", "Id mongo no valido").isMongoId(), validate],
  getFilesFolder
);

export default folderRouter;
