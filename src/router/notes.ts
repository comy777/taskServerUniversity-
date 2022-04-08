import { Router } from "express";
import { validateToken } from "../jwt/jwt";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";
import { getNotes, saveNote, editNote, deleteNote } from "../controllers/note";

const notesRouter = Router();

notesRouter.get(
  "/:lesson",
  [validateToken, check("lesson", "Clase requerida").isMongoId(), validate],
  getNotes
);

notesRouter.post(
  "/:lesson",
  [validateToken, check("lesson", "Clase requerida").isMongoId(), validate],
  saveNote
);

notesRouter.put(
  "/:note_id",
  [
    validateToken,
    check("note_id", "Id de la nota no valido").isMongoId(),
    validate,
  ],
  editNote
);

notesRouter.delete(
  "/:note_id",
  [
    validateToken,
    check("note_id", "Id de la nota no valido").isMongoId(),
    validate,
  ],
  deleteNote
);

export default notesRouter;
