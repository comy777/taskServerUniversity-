import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { uploadImage } from "../controllers/upload";

const uploadRouter = Router();

uploadRouter.put("/", [validateToken], uploadImage);

export default uploadRouter;
