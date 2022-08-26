import { Router } from "express";
import { getIcons } from "../controllers/faticon";
import { validateToken } from "../jwt/jwt";

const faticonRouter = Router();

faticonRouter.get("/:q", [validateToken], getIcons);

export default faticonRouter;
