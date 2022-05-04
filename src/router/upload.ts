import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { deleteImageUpload, uploadImage } from "../controllers/upload";

const uploadRouter = Router();

uploadRouter.put("/", [validateToken], uploadImage);

uploadRouter.delete("/:id", [validateToken], deleteImageUpload);

export default uploadRouter;
