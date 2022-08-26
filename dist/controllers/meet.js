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
exports.deleteMeet = exports.updateMeet = exports.saveMeet = exports.getMeets = void 0;
const moment_1 = __importDefault(require("moment"));
const Meet_1 = __importDefault(require("../models/Meet"));
const deleteMeetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const validateMeet = yield Meet_1.default.findById(id);
    if (!validateMeet)
        return;
    yield Meet_1.default.findByIdAndUpdate(id, { state: false });
});
const getMeets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = { user, state: true };
    const meets = yield Meet_1.default.find(query);
    let bandera = false;
    const fechaActual = (0, moment_1.default)();
    yield meets.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        const { date_meet, start_time, _id } = item;
        const diferenciaDias = (0, moment_1.default)(date_meet).diff(fechaActual, "days");
        if (diferenciaDias < 0) {
            bandera = true;
            yield deleteMeetById(_id);
            return;
        }
        const hora = (0, moment_1.default)(start_time, "HH:mm a");
        const diferenciaHoras = (0, moment_1.default)(hora).diff(fechaActual, "hours");
        if (diferenciaHoras < 0) {
            if (!bandera)
                bandera = true;
            yield deleteMeetById(_id);
            return;
        }
    }));
    if (bandera) {
        const newMeets = yield Meet_1.default.find(query);
        return res.send({ meets: newMeets });
    }
    return res.send({ meets });
});
exports.getMeets = getMeets;
const saveMeet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { meet, link } = req.body;
    const meetByName = yield Meet_1.default.findOne({
        user,
        meet,
        state: true,
    });
    if (meetByName)
        return res.send({ error: "La reunion ya se encuentra registrada" });
    if (link) {
        const meetByLink = yield Meet_1.default.findOne({
            user,
            link,
            state: true,
        });
        if (meetByLink)
            return res.send({
                error: "La reunion ya se encuentra registrada por el link",
            });
    }
    try {
        const meetData = new Meet_1.default(req.body);
        meetData.user = user;
        const saveMeet = yield meetData.save();
        return res.send({ meet: saveMeet });
    }
    catch (error) {
        res.send({ error: "Error del servidor" });
        console.log(error);
    }
});
exports.saveMeet = saveMeet;
const updateMeet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const meetById = yield Meet_1.default.findById(id);
    if (!meetById)
        return res.send({ error: "La reunion no se encuentra registrada" });
    if (meetById.user.toString() !== user)
        return res.send({
            error: "No tiene permisos para modificar la reunion",
        });
    try {
        const { meet, link, start_time, date_meet } = req.body;
        const data = {
            meet: meet ? meet : meetById.meet,
            link: link ? link : meetById.link,
            start_time: start_time ? start_time : meetById.start_time,
            date_meet: date_meet ? date_meet : meetById.date_meet,
        };
        const updateMeet = yield Meet_1.default.findByIdAndUpdate(id, data, {
            new: true,
        });
        return res.send({ meet: updateMeet });
    }
    catch (error) {
        res.send({ error: "Error del servidor" });
        console.log(error);
    }
});
exports.updateMeet = updateMeet;
const deleteMeet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const meetById = yield Meet_1.default.findById(id);
    if (!meetById)
        return res.send({ error: "La reunion no se encuentra registrada" });
    if (meetById.user.toString() !== user)
        return res.send({
            error: "No tiene permisos para modificar la reunion",
        });
    try {
        yield Meet_1.default.findByIdAndUpdate(id, { state: false });
        return res.send({ msg: "Reunion eliminada" });
    }
    catch (error) {
        res.send({ error: "Error del servidor" });
        console.log(error);
    }
});
exports.deleteMeet = deleteMeet;
