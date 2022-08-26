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
exports.getIcons = void 0;
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../axios/config");
const Token_1 = __importDefault(require("../models/Token"));
const saveTokenStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    const dataToken = yield getTokenFaticon();
    const tokenSave = new Token_1.default(dataToken);
    yield tokenSave.save();
    return tokenSave;
});
const getTokenFaticon = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = "app/authentication";
    const data = { apikey: process.env.API_FATICON };
    const resp = yield config_1.appFaticonApi.post(url, data);
    const { token, expires } = resp.data.data;
    const fechaActual = (0, moment_1.default)();
    const dataResp = { token, expires, created: fechaActual };
    return dataResp;
});
const validateTokenFaticon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { created } = data;
    const fechaActual = (0, moment_1.default)();
    const diferenciaHoras = (0, moment_1.default)(created).diff(fechaActual, "minutes");
    if (diferenciaHoras > 50) {
        console.log("Refrescar token");
        const { _id } = data;
        const dataToken = getTokenFaticon();
        const resp = yield Token_1.default.findByIdAndUpdate(_id, dataToken, {
            new: true,
        });
        if (!resp)
            return [data];
        return [resp];
    }
    return [data];
});
const getIcons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.params;
    let tokenStorage = yield Token_1.default.find();
    if (tokenStorage.length === 0) {
        tokenStorage = yield saveTokenStorage();
    }
    else {
        tokenStorage = yield validateTokenFaticon(tokenStorage[0]);
    }
    const { token } = tokenStorage[0];
    const { data } = yield config_1.appFaticonApi.get(`search/icons?q=${q}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    const { data: dataIcons } = data;
    return res.send({ icons: dataIcons[0] });
});
exports.getIcons = getIcons;
