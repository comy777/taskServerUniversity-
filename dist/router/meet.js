"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meet_1 = require("../controllers/meet");
const jwt_1 = require("../jwt/jwt");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middlewares/validate");
const meetRouter = (0, express_1.Router)();
meetRouter.get("/", [jwt_1.validateToken], meet_1.getMeets);
meetRouter.post("/", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("meet", "El nombre de la reunion es requerido").notEmpty(),
    (0, express_validator_1.check)("date_meet", "La fecha es requerido").notEmpty(),
    (0, express_validator_1.check)("date_meet", "No es formato fecha").isDate(),
    (0, express_validator_1.check)("start_time", "La hora es requerido").notEmpty(),
    validate_1.validate,
], meet_1.saveMeet);
meetRouter.put("/:id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("id", "El id de la reunion es requerido"),
    (0, express_validator_1.check)("id", "No es un mongo id valido").isMongoId(),
    validate_1.validate,
], meet_1.updateMeet);
meetRouter.delete("/:id", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("id", "El id de la reunion es requerido"),
    (0, express_validator_1.check)("id", "No es un mongo id valido").isMongoId(),
    validate_1.validate,
], meet_1.deleteMeet);
exports.default = meetRouter;
