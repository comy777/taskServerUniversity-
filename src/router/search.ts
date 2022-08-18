import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { searchTerm } from "../controllers/search";

const searchRouter = Router();

searchRouter.get("/:term", [validateToken], searchTerm);

export default searchRouter;
