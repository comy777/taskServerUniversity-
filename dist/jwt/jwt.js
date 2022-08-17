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
exports.validateTokenCheck = exports.validateTokenAuth = exports.refreshToken = exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const User_2 = __importDefault(require("../models/User"));
const generateToken = (user, expiresIn) => {
    const payload = { id: user._id, email: user.email };
    try {
        return jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
            expiresIn,
        });
    }
    catch (error) {
        console.log(error);
        return "Error";
    }
};
exports.generateToken = generateToken;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"];
    if (!token)
        return res.send({ error: "Token requerido" });
    const dataToken = yield (0, exports.refreshToken)(token);
    try {
        const data = jsonwebtoken_1.default.verify(dataToken, process.env.SECRET_KEY);
        const { id } = data;
        const user = yield User_2.default.findById(id);
        if (!user.state)
            return res.send({ error: "El usuario no esta registrado" });
        req.user = id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Refrescar token" });
    }
});
exports.validateToken = validateToken;
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const userToken = jsonwebtoken_1.default.decode(token);
    const { id } = userToken;
    const user = yield User_1.default.findById(id);
    if (!user)
        return "Error";
    const dataToken = (0, exports.generateToken)(user, "7d");
    return dataToken;
});
exports.refreshToken = refreshToken;
const validateTokenAuth = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const { email } = payload;
        return email;
    }
    catch (error) {
        return null;
    }
};
exports.validateTokenAuth = validateTokenAuth;
const validateTokenCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token)
        return res.send({ error: "Token requerido" });
    try {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch (error) {
        return res.send({ error: "Token no valido" });
    }
});
exports.validateTokenCheck = validateTokenCheck;
