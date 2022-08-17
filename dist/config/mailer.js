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
exports.sendEmailPassword = exports.sendVerification = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "taskserveruniversity@gmail.com",
        pass: process.env.PASSWORD_EMAIL,
    },
});
const sendVerification = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const urlLocal = `http://localhost:5050/auth/validate-email/${token}`;
    const url = `https://task-university.herokuapp.com/auth/validate-email/${token}`;
    return yield exports.transporter.sendMail({
        from: '"Fred Foo 👻" <taskserveruniversity@gmail.com>',
        to: email,
        subject: "Validar correo electronico",
        html: `
      <b>Please click on the following link, or paste this into your browser to complete the process:</b>
      <hr/>
      <br/>
      <a href="${urlLocal}" >
        Verificar correo electronico
      </a>
    `,
    });
});
exports.sendVerification = sendVerification;
const sendEmailPassword = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const urlLocal = `http://localhost:5050/auth/reset-password/${token}`;
    const url = `https://task-university.herokuapp.com/auth/reset-password/${token}`;
    return yield exports.transporter.sendMail({
        from: '"Fred Foo 👻" <taskserveruniversity@gmail.com>',
        to: email,
        subject: "Recuperar contraseña",
        html: `
      <b>Please click on the following link, or paste this into your browser to complete the process:</b>
      <hr/>
      <br/>
      <a href="${urlLocal}" >
        Recuperar contraseña      
      </a>
    `,
    });
});
exports.sendEmailPassword = sendEmailPassword;
