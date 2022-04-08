"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../jwt/jwt");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middlewares/validate");
const note_1 = require("../controllers/note");
const notesRouter = (0, express_1.Router)();
notesRouter.get("/:lesson", [jwt_1.validateToken, (0, express_validator_1.check)("lesson", "Clase requerida").isMongoId(), validate_1.validate], note_1.getNotes);
notesRouter.post("/:lesson", [jwt_1.validateToken, (0, express_validator_1.check)("lesson", "Clase requerida").isMongoId(), validate_1.validate], note_1.saveNote);
notesRouter.put("/:note_id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("note_id", "Id de la nota no valido").isMongoId(),
    validate_1.validate,
], note_1.editNote);
notesRouter.delete("/:note_id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("note_id", "Id de la nota no valido").isMongoId(),
    validate_1.validate,
], note_1.deleteNote);
exports.default = notesRouter;
