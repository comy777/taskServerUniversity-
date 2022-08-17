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
exports.resetPassword = exports.forgetPassword = exports.verifyEmail = exports.userVerify = exports.validateEmail = exports.setProfile = exports.getUser = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../jwt/jwt");
const upload_1 = require("../utils/upload");
const mailer_1 = require("../config/mailer");
const tokenUser = (user, email, res) => __awaiter(void 0, void 0, void 0, function* () {
    let expiresIn = "7d";
    let token = "";
    if (!user.verify) {
        token = (0, jwt_1.generateToken)(user, "10m");
        yield (0, mailer_1.sendVerification)(email, token);
        return res.send({ msg: "Revise su bandeja de correo electronico" });
    }
    if (user.verify)
        token = (0, jwt_1.generateToken)(user, expiresIn);
    return res.send({ token });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.send({ error: "El usuario no se encuentra registrado" });
    const validatePassword = bcryptjs_1.default.compareSync(password, user.password);
    if (!validatePassword)
        return res.send({ error: "El correo y la contraseña no coinciden" });
    //Token
    yield tokenUser(user, email, res);
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
        yield tokenUser(user, email, res);
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
const validateEmail = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const email = (0, jwt_1.validateTokenAuth)(token);
    if (!email)
        return resp.redirect(`/validate-email.html?auth=${token}`);
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return resp.send({ error: "Usuario no registrado" });
    if (user.verify)
        return resp.redirect(`/validate-email.html?auth=${token}`);
    try {
        yield User_1.default.findByIdAndUpdate(user._id, { verify: true });
        return resp.redirect(`/user-verify.html?auth=${token}`);
    }
    catch (error) {
        console.log(error);
        return resp.send({ error: "Error del servidor" });
    }
});
exports.validateEmail = validateEmail;
const userVerify = (req, res) => {
    const { token } = req.params;
    const validateToken = (0, jwt_1.validateTokenAuth)(token);
    if (validateToken)
        return res.send({ msg: "verify" });
    return res.send({ msg: null });
};
exports.userVerify = userVerify;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.send({ error: "Usuario no registrado" });
    if (user.verify)
        return res.send({ msg: "Correo electronico ya verificado" });
    yield tokenUser(user, email, res);
});
exports.verifyEmail = verifyEmail;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.send({ error: "Usuario no registrado" });
    const token = (0, jwt_1.generateToken)(user, "10m");
    yield (0, mailer_1.sendEmailPassword)(email, token);
    return res.send({ msg: "Revise su bandeja de correo electronico" });
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const email = (0, jwt_1.validateTokenAuth)(token);
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.send({ error: "Usuario no registrado" });
    const { password, newPassword } = req.body;
    const validatePassword = bcryptjs_1.default.compareSync(password, user.password);
    if (!validatePassword)
        return res.send({ error: "Contraseña no valida" });
    try {
        const salt = bcryptjs_1.default.genSaltSync();
        const hashPassword = bcryptjs_1.default.hashSync(newPassword, salt);
        const data = yield User_1.default.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
        console.log(data);
        return res.send({ msg: "Contraseña actualizada exitosamente" });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error del servidor" });
    }
});
exports.resetPassword = resetPassword;
