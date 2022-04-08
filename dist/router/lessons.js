"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../jwt/jwt");
const lessons_1 = require("../controllers/lessons");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middlewares/validate");
const lessonsRouter = (0, express_1.Router)();
lessonsRouter.get("/", [jwt_1.validateToken], lessons_1.getLessons);
lessonsRouter.post("/", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("lesson", "Nombre de la clase requerdido").notEmpty(),
    validate_1.validate,
], lessons_1.saveLesson);
lessonsRouter.put("/:id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("id", "No es un id valido").isMongoId(),
    (0, express_validator_1.check)("id", "El id es requerido").notEmpty(),
    validate_1.validate,
], lessons_1.editLesson);
lessonsRouter.delete("/:id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("id", "No es un id valido").isMongoId(),
    (0, express_validator_1.check)("id", "El id es requerido").notEmpty(),
    validate_1.validate,
], lessons_1.deleteLesson);
exports.default = lessonsRouter;
