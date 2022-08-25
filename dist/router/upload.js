"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importStar(require("multer"));
const jwt_1 = require("../jwt/jwt");
const upload_1 = require("../controllers/upload");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middlewares/validate");
const upload_2 = require("../controllers/upload");
const upload = (0, multer_1.default)({ storage: (0, multer_1.memoryStorage)() }).single("file");
const uploadImageMulter = (0, multer_1.default)({ dest: "./src/uploads/" }).single("image");
const uploadRouter = (0, express_1.Router)();
uploadRouter.put("/", [jwt_1.validateToken, uploadImageMulter], upload_1.uploadImage);
uploadRouter.delete("/:id", [jwt_1.validateToken], upload_1.deleteImageUpload);
uploadRouter.get("/file/:lesson", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("lesson", "No es un mongo id valido").isMongoId(),
    validate_1.validate,
], upload_2.getFiles);
uploadRouter.post("/file/:lesson", [
    jwt_1.validateToken,
    (0, express_validator_1.check)("lesson", "Mongo id no valido").isMongoId(),
    validate_1.validate,
    upload,
], upload_1.uploadFile);
uploadRouter.delete("/file/:id", [jwt_1.validateToken, (0, express_validator_1.check)("id", "Mongo id no valido").isMongoId(), validate_1.validate], upload_2.deleteFileFirebase);
exports.default = uploadRouter;
