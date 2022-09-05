import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { validateToken } from "../jwt/jwt";
import {
  deleteImageUpload,
  uploadImage,
  uploadFile,
} from "../controllers/upload";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";
import { getFiles, deleteFile } from "../controllers/upload";

const upload = multer({ storage: memoryStorage() }).single("file");
const uploadImageMulter = multer({ dest: "./src/uploads/" }).single("image");

const uploadRouter = Router();

uploadRouter.put("/", [validateToken, uploadImageMulter], uploadImage);

uploadRouter.delete("/:id", [validateToken], deleteImageUpload);

uploadRouter.get(
  "/file/:lesson",
  [
    validateToken,
    check("lesson", "No es un mongo id valido").isMongoId(),
    validate,
  ],
  getFiles
);

uploadRouter.post(
  "/file/:lesson",
  [
    validateToken,
    check("lesson", "Mongo id no valido").isMongoId(),
    validate,
    upload,
  ],
  uploadFile
);

uploadRouter.post(
  "/file/:lesson/:folder",
  [
    validateToken,
    check("lesson", "Mongo id no valido").isMongoId(),
    check("folder", "Mongo id no valido").isMongoId(),
    validate,
    upload,
  ],
  uploadFile
);

uploadRouter.delete(
  "/file/:id",
  [validateToken, check("id", "Mongo id no valido").isMongoId(), validate],
  deleteFile
);

export default uploadRouter;
