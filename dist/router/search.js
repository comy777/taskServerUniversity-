"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../jwt/jwt");
const search_1 = require("../controllers/search");
const searchRouter = (0, express_1.Router)();
searchRouter.get("/:term", [jwt_1.validateToken], search_1.searchTerm);
exports.default = searchRouter;
