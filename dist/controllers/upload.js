"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const upload_1 = require("../utils/upload");
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.send({ msg: "No files were uploaded." });
    }
    if (!req.files.image) {
        return res.send({ msg: "No hay imagenes para subir" });
    }
    try {
        const { image } = req.files;
        const resp = yield (0, upload_1.uploadImageCloudinary)(image);
        if (!resp)
            return res.send({ error: "Error al subir imagen" });
        const { secure_url } = resp;
        return res.send({ url: secure_url });
    }
    catch (error) {
        console.log(error);
        res.send({
            error: "Error del servidor",
        });
    }
});
exports.uploadImage = uploadImage;
