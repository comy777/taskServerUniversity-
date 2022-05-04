"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const jwt_1 = require("../jwt/jwt");
const validate_1 = require("../middlewares/validate");
const authRouter = (0, express_1.Router)();
authRouter.post("/", [
    (0, express_validator_1.check)("email", "Correo electronico requerido").notEmpty(),
    (0, express_validator_1.check)("email", "Correo electronico no valido").isEmail(),
    (0, express_validator_1.check)("password", "contraseña requerida").notEmpty(),
    validate_1.validate,
], auth_1.login);
authRouter.post("/register", [
    (0, express_validator_1.check)("email", "Correo electronico requerido").notEmpty(),
    (0, express_validator_1.check)("email", "Correo electronico no valido").isEmail(),
    (0, express_validator_1.check)("password", "contraseña requerida"),
    (0, express_validator_1.check)("password", "La contraseña debe tener mas de 8 caracteres").isLength({
        min: 8,
    }),
    validate_1.validate,
], auth_1.register);
authRouter.get("/", [jwt_1.validateToken], auth_1.getUser);
authRouter.put("/", [jwt_1.validateToken], auth_1.setProfile);
exports.default = authRouter;
