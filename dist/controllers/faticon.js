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
exports.getIconsFile = exports.getIcons = void 0;
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
    if (diferenciaHoras <= 0) {
        const { _id } = data;
        const dataToken = yield getTokenFaticon();
        const tokenStorage = yield Token_1.default.findByIdAndUpdate(_id, dataToken, {
            new: true,
        });
        return tokenStorage;
    }
    return data;
});
const tokenStorageData = (q) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenStorage = yield Token_1.default.find();
    if (tokenStorage.length === 0) {
        tokenStorage = yield saveTokenStorage();
    }
    else {
        const resp = yield validateTokenFaticon(tokenStorage[0]);
        if (!resp)
            return;
        const { token } = resp;
        const { data } = yield config_1.appFaticonApi.get(`search/icons?q=${q}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return data;
    }
    const { token } = tokenStorage[0];
    const { data } = yield config_1.appFaticonApi.get(`search/icons?q=${q}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    return data;
});
const getIcons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.params;
    const data = yield tokenStorageData(q);
    if (!data)
        return res.send({ error: "Error del servidor" });
    const { data: dataIcons } = data;
    return res.send({ icon: dataIcons[0].images["512"] });
});
exports.getIcons = getIcons;
const getIconsFile = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield tokenStorageData(query);
    if (!data)
        return;
    const { data: dataIcons } = data;
    return dataIcons[0].images["512"];
});
exports.getIconsFile = getIconsFile;
