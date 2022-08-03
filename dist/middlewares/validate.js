"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDay = exports.validate = exports.days = void 0;
const express_validator_1 = require("express-validator");
exports.days = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.send({ error: errors.array()[0].msg });
    }
    next();
};
exports.validate = validate;
const validateDay = (day) => {
    const data = day.toUpperCase();
    if (!exports.days.includes(data)) {
        throw new Error(`El dia ${day} no es valido`);
    }
    return true;
};
exports.validateDay = validateDay;
