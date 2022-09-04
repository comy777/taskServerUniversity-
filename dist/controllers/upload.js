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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFirebase = exports.uploadFile = exports.getFiles = exports.deleteImageUpload = exports.uploadImage = void 0;
const storage_1 = require("firebase/storage");
const config_1 = require("../firebase/config");
const File_1 = __importDefault(require("../models/File"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const upload_1 = require("../utils/upload");
const helpers_1 = require("../utils/helpers");
const Folder_1 = __importDefault(require("../models/Folder"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.send({ error: "No hay imagenes para subir" });
    try {
        const image = req.file;
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
const deleteImageUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resp = yield (0, upload_1.deleteImage)(id);
        if (!resp)
            res.send({ error: "Error al eliminar la imagen, o imagen no existe" });
        return res.send({ msg: "Imagen Eliminada" });
    }
    catch (error) {
        console.log(error);
        res.send({
            error: "Error del servidor",
        });
    }
});
exports.deleteImageUpload = deleteImageUpload;
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { lesson } = req.params;
    const validateLesson = yield Lesson_1.default.findById(lesson);
    if (!validateLesson)
        return res.send({ error: "La clase no se encuentra registrada" });
    const query = { lesson, user, state: true };
    const files = yield File_1.default.find(query);
    return res.send({ files });
});
exports.getFiles = getFiles;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.send({ error: "No hay archivos para subir" });
    const user = req.user;
    const { lesson, folder } = req.params;
    let folderName = undefined;
    if (folder) {
        const validate = yield (0, helpers_1.validateFolderById)(folder, user);
        if (validate.error)
            return res.send({ error: validate.error });
        const folderData = yield Folder_1.default.findById(folder);
        folderName = folderData.folder;
    }
    const validateLesson = yield Lesson_1.default.findById(lesson);
    if (!validateLesson)
        return res.send({ error: "La clase no existe" });
    if (validateLesson.user.toString() !== user)
        return res.send({ error: "No tiene permiso" });
    const file = req.file;
    try {
        const data = yield (0, helpers_1.uploadFileFirebase)(file, user, lesson, folderName);
        if (data) {
            const fileData = new File_1.default(data);
            yield fileData.save();
            if (folder) {
                if (folderName) {
                    const query = { lesson, user, state: true, folder: folderName };
                    const files = yield File_1.default.find(query);
                    const filesUpdated = files.map((item) => ({ file: item._id }));
                    yield Folder_1.default.findByIdAndUpdate(folder, {
                        files: filesUpdated,
                    });
                }
            }
            return res.send({ file: fileData });
        }
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error al subir archivo" });
    }
});
exports.uploadFile = uploadFile;
const deleteFileFirebase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const validateFile = yield File_1.default.findById(id);
    if (!validateFile)
        return res.send({ error: "El archivo no existe" });
    if (validateFile.user.toString() !== user)
        return res.send({ error: "No tiene permisos" });
    const storageRef = (0, storage_1.ref)(config_1.storage, validateFile.refFile);
    try {
        yield (0, storage_1.deleteObject)(storageRef);
        const { _id } = validateFile;
        yield File_1.default.findByIdAndUpdate(_id, { state: false });
        return res.send({ msg: "Archivo eliminado" });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error del servidor" });
    }
});
exports.deleteFileFirebase = deleteFileFirebase;
