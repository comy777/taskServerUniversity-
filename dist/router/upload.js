"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../jwt/jwt");
const upload_1 = require("../controllers/upload");
const uploadRouter = (0, express_1.Router)();
uploadRouter.put("/", [jwt_1.validateToken], upload_1.uploadImage);
uploadRouter.delete("/:id", [jwt_1.validateToken], upload_1.deleteImageUpload);
exports.default = uploadRouter;
