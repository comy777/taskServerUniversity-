"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const schedlue_1 = require("../controllers/schedlue");
const jwt_1 = require("../jwt/jwt");
const validate_1 = require("../middlewares/validate");
const schedlueRouter = (0, express_1.Router)();
schedlueRouter.get("/", [jwt_1.validateToken], schedlue_1.getSchedlue);
schedlueRouter.post("/", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("day", "El dia es requerido").notEmpty(),
    (0, express_validator_1.check)("day").custom(validate_1.validateDay),
    (0, express_validator_1.check)("schedlue", "El horario es requerido").notEmpty(),
    validate_1.validate,
], schedlue_1.saveSchedlue);
schedlueRouter.put("/:id", [jwt_1.validateToken, (0, express_validator_1.check)("id", "Id no valido").isMongoId(), validate_1.validate], schedlue_1.updateSchedlue);
schedlueRouter.delete("/:id", [jwt_1.validateToken, (0, express_validator_1.check)("id", "Id no valido").isMongoId(), validate_1.validate], schedlue_1.deleteSchedlue);
exports.default = schedlueRouter;
