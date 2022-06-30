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
exports.completeTask = exports.deleteTask = exports.editTask = exports.saveTask = exports.getTasks = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Task_1 = __importDefault(require("../models/Task"));
const upload_1 = require("../utils/upload");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { lesson } = req.params;
    const lessonValid = yield Lesson_1.default.findById(lesson);
    if (!lessonValid)
        return res.send({ error: 'La clase no existe' });
    const query = { state: true, user: id, lesson };
    const tasks = yield Task_1.default.find(query);
    return res.send({ tasks });
});
exports.getTasks = getTasks;
const saveTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const lesson = yield Lesson_1.default.findById(id);
    if (!lesson)
        return res.send({ error: 'La clase no existe' });
    if (lesson.user.toString() !== user)
        return res.send({ error: 'No tiene permisos para agregar la tarea' });
    if (!req.body.title && !req.body.body)
        return res.send({ error: 'Tarea no almacenada' });
    try {
        const task = new Task_1.default(req.body);
        task.user = user;
        task.lesson = id;
        yield task.save();
        return res.send({ task });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.saveTask = saveTask;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const taskValid = yield Task_1.default.findById(id);
    if (!taskValid)
        return res.send({ error: 'La tarea no existe' });
    if (taskValid.user.toString() !== user)
        return res.send({ error: 'No tiene permisos para agregar la tarea' });
    try {
        const task = yield Task_1.default.findOneAndUpdate({ _id: id }, req.body, {
            new: true
        });
        return res.send({ task });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.editTask = editTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const taskValid = yield Task_1.default.findById(id);
    if (!taskValid)
        return res.send({ error: 'La tarea no existe' });
    if (taskValid.user.toString() !== user)
        return res.send({ error: 'No tiene permisos para agregar la tarea' });
    const { images } = taskValid;
    if (images.length > 0) {
        images.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const idImage = item.uri.split('/');
            let data = idImage[idImage.length - 1];
            data = data.split('.');
            const resp = yield (0, upload_1.deleteImage)(data[0]);
            if (!resp)
                return res.send({ error: 'Error del servidor' });
        }));
    }
    try {
        yield Task_1.default.findOneAndUpdate({ _id: id }, { state: false, images: [] });
        return res.send({ msg: 'Tarea eliminada' });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.deleteTask = deleteTask;
const completeTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const taskValid = yield Task_1.default.findById(id);
    if (!taskValid)
        return res.send({ error: 'La tarea no existe' });
    if (taskValid.user.toString() !== user)
        return res.send({ error: 'No tiene permisos para agregar la tarea' });
    try {
        const { complete } = taskValid;
        yield Task_1.default.findOneAndUpdate({ _id: id }, { complete: !complete }, { new: true });
        return res.send({ msg: 'Tarea actualizada' });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.completeTask = completeTask;
