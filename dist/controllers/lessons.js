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
exports.deleteLesson = exports.editLesson = exports.saveLesson = exports.getLessons = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Schedlue_1 = __importDefault(require("../models/Schedlue"));
const upload_1 = require("../utils/upload");
const getLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = { user, state: true };
    const lessons = yield Lesson_1.default.find(query);
    if (lessons.length === 0) {
        const data = yield Schedlue_1.default.find({ user });
        if (data.length > 0) {
            data.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield Schedlue_1.default.findByIdAndDelete(item._id);
            }));
        }
    }
    return res.send({ lessons });
});
exports.getLessons = getLessons;
const saveLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const lessonName = yield Lesson_1.default.findOne({
        lesson: req.body.lesson,
        state: true,
    });
    if (lessonName)
        return res.send({ error: "La clase ya esta registrada" });
    const lessonNrc = yield Lesson_1.default.findOne({ nrc: req.body.nrc, state: true });
    if (lessonNrc)
        return res.send({ error: "La clase ya esta registrada" });
    const lesson = new Lesson_1.default(req.body);
    lesson.user = id;
    try {
        const data = yield lesson.save();
        const { schedlue } = data;
        yield (0, upload_1.saveSchedlueLesson)(schedlue, id);
        return res.send({ lesson });
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveLesson = saveLesson;
const editLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const lesson = yield Lesson_1.default.findById(id);
    if (!lesson)
        return res.send({ error: "La clase no existe" });
    if (lesson.user.toString() !== user)
        return res.send({ error: "No puede modificar esta clase" });
    try {
        const resp = yield Lesson_1.default.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        const { schedlue } = req.body;
        if (schedlue.length === 0) {
            if (lesson.schedlue.length > 0) {
                yield (0, upload_1.deleteSchedlueLesson)(lesson.schedlue, user);
            }
        }
        else {
            if (schedlue.length < lesson.schedlue.length) {
                yield (0, upload_1.deleteSchedlueLesson)(lesson.schedlue, user);
            }
            yield (0, upload_1.saveSchedlueLesson)(schedlue, user);
        }
        return res.send({ lesson: resp });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error del servidor" });
    }
});
exports.editLesson = editLesson;
const deleteLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const lesson = yield Lesson_1.default.findById(id);
    if (!lesson)
        return res.send({ error: "La clase no existe" });
    if (lesson.user.toString() !== user)
        return res.send({ error: "No puede modificar esta clase" });
    const { schedlue } = lesson;
    yield (0, upload_1.deleteSchedlueLesson)(schedlue, user);
    try {
        yield Lesson_1.default.findOneAndUpdate({ _id: id }, { state: false });
        return res.send({ msg: "Clase eliminada" });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: "Error del servidor" });
    }
});
exports.deleteLesson = deleteLesson;
