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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedlue = exports.updateSchedlue = exports.saveSchedlue = exports.getSchedlue = void 0;
const Schedlue_1 = __importDefault(require("../models/Schedlue"));
const getSchedlue = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = { user };
    const data = yield Schedlue_1.default.find(query);
    const arr = [];
    data.forEach((item, i) => {
        if (item.day === "LUNES") {
            arr[i] = { item, index: 0 };
            return;
        }
        if (item.day === "MARTES") {
            arr[i] = { item, index: 1 };
            return;
        }
        if (item.day === "MIERCOLES") {
            arr[i] = { item, index: 2 };
            return;
        }
        if (item.day === "JUEVES") {
            arr[i] = { item, index: 3 };
            return;
        }
        if (item.day === "VIERNES") {
            arr[i] = { item, index: 4 };
            return;
        }
        if (item.day === "SABADO") {
            arr[i] = { item, index: 5 };
            return;
        }
    });
    const orden = arr.sort((a, b) => {
        if (a.index < b.index)
            return -1;
        return 1;
    });
    const schedlue = orden.map((item) => {
        const { index } = item, data = __rest(item, ["index"]);
        return data;
    });
    return resp.send({ schedlue });
});
exports.getSchedlue = getSchedlue;
const saveSchedlue = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { day } = req.body;
    const query = { day, user };
    const schedlue = yield Schedlue_1.default.findOne(query);
    if (schedlue)
        return resp.send({ error: "El dia ya se encuentra registrado" });
    const data = new Schedlue_1.default(req.body);
    data.day = day.toUpperCase();
    data.user = user;
    try {
        const dataSave = yield data.save();
        return resp.send({ schedlue: dataSave });
    }
    catch (error) {
        console.log(error);
        return resp.send({ error: "Error del servidor" });
    }
});
exports.saveSchedlue = saveSchedlue;
const updateSchedlue = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const _a = req.body, { day } = _a, data = __rest(_a, ["day"]);
    const schedlueData = yield Schedlue_1.default.findById(id);
    if (!schedlueData)
        return resp.send({ error: "El dia no se encuentra registrado" });
    if (schedlueData.user.toString() !== user) {
        return resp.send({
            error: "No tiene permisos para eliminar este horario",
        });
    }
    try {
        const dataSave = yield Schedlue_1.default.findByIdAndUpdate(id, data, { new: true });
        return resp.send({ schedlue: dataSave });
    }
    catch (error) {
        console.log(error);
        return resp.send({ error: "Error del servidor" });
    }
});
exports.updateSchedlue = updateSchedlue;
const deleteSchedlue = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const schedlue = yield Schedlue_1.default.findById(id);
    if (!schedlue)
        return resp.send({ error: "El dia no se encuentra registrado" });
    if (schedlue.user.toString() !== user) {
        return resp.send({
            error: "No tiene permisos para eliminar este horario",
        });
    }
    try {
        yield Schedlue_1.default.findByIdAndDelete(id);
        return resp.send({ msg: "Horario eliminado" });
    }
    catch (error) {
        console.log(error);
        return resp.send({ error: "Error del servidor" });
    }
});
exports.deleteSchedlue = deleteSchedlue;
