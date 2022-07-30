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
exports.setProfile = exports.getUser = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../jwt/jwt");
const upload_1 = require("../utils/upload");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.send({ error: "El usuario no se encuentra registrado" });
    const validatePassword = bcryptjs_1.default.compareSync(password, user.password);
    if (!validatePassword)
        return res.send({ error: "El correo y la contraseña no coinciden" });
    //Token
    const token = (0, jwt_1.generateToken)(user);
    return res.send({ token });
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield User_1.default.findOne({ email });
    if (user)
        return res.send({ error: "El usuario ya se encuentra registrado" });
    try {
        user = new User_1.default(req.body);
        const salt = bcryptjs_1.default.genSaltSync();
        user.password = bcryptjs_1.default.hashSync(password, salt);
        yield user.save();
        const token = (0, jwt_1.generateToken)(user);
        return res.send({ token });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error del servidor" });
    }
});
exports.register = register;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    console.log(id);
    const user = yield User_1.default.findById(id);
    if (!user)
        return res.send({ error: "Usuario no registrado" });
    return res.send({ user });
});
exports.getUser = getUser;
const setProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const userValid = yield User_1.default.findById(id);
    if (!userValid)
        return res.send({ error: "Usuario no registrado" });
    const { image } = userValid;
    const { image: imageNew } = req.body;
    if (imageNew) {
        if (image) {
            const idImage = image.split("/");
            let data = idImage[idImage.length - 1];
            data = data.split(".");
            const resp = yield (0, upload_1.deleteImage)(data[0]);
            if (!resp)
                return res.send({ error: "Error del servidor" });
        }
    }
    try {
        const resp = yield User_1.default.findByIdAndUpdate(id, req.body, { new: true });
        return res.send({ user: resp });
    }
    catch (error) {
        console.log(error);
    }
});
exports.setProfile = setProfile;
