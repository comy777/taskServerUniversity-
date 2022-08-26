"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faticon_1 = require("../controllers/faticon");
const jwt_1 = require("../jwt/jwt");
const faticonRouter = (0, express_1.Router)();
faticonRouter.get("/:q", [jwt_1.validateToken], faticon_1.getIcons);
exports.default = faticonRouter;
