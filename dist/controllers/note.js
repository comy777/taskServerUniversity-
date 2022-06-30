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
exports.deleteNote = exports.editNote = exports.saveNote = exports.getNotes = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Note_1 = __importDefault(require("../models/Note"));
const upload_1 = require("../utils/upload");
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { lesson } = req.params;
    const lessonValid = yield Lesson_1.default.findById(lesson);
    if (!lessonValid)
        return res.send({ error: 'La clase no existe' });
    const query = { state: true, user: id, lesson };
    const notes = yield Note_1.default.find(query);
    return res.send({ notes });
});
exports.getNotes = getNotes;
const saveNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { lesson } = req.params;
    const lessonValid = yield Lesson_1.default.findById(lesson);
    if (!lessonValid)
        return res.send({ error: 'La clase no esta registrada' });
    if (!lessonValid.state)
        return res.send({ error: 'La clase no esta registrada' });
    const note = new Note_1.default(req.body);
    note.user = id;
    note.lesson = lesson;
    try {
        yield note.save();
        return res.send({ note });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.saveNote = saveNote;
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { note_id } = req.params;
    const noteValid = yield Note_1.default.findById(note_id);
    if (!noteValid.state)
        return res.send({ error: 'La nota no esta registrada' });
    if (noteValid.user.toString() !== id)
        return res.send({ error: 'No tiene permisos para eliminar la nota' });
    try {
        const note = yield Note_1.default.findOneAndUpdate({ _id: note_id }, req.body, {
            new: true
        });
        return res.send({ note });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.editNote = editNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { note_id } = req.params;
    const noteValid = yield Note_1.default.findById(note_id);
    if (!noteValid)
        return res.send({ error: 'Nota no encontrada' });
    if (!noteValid.state)
        return res.send({ error: 'La nota no esta registrada' });
    if (noteValid.user.toString() !== id)
        return res.send({ error: 'No tiene permisos para eliminar la nota' });
    const { images } = noteValid;
    if (images.length > 0) {
        images.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const idImage = item.url.split('/');
            let data = idImage[idImage.length - 1];
            data = data.split('.');
            const resp = yield (0, upload_1.deleteImage)(data[0]);
            if (!resp)
                return res.send({ error: 'Error del servidor' });
        }));
    }
    try {
        yield Note_1.default.findOneAndUpdate({ _id: note_id }, { state: false, images: [] });
        return res.send({ msg: 'Nota eliminada' });
    }
    catch (error) {
        console.log(error);
        return res.send({ error: 'Error del servidor' });
    }
});
exports.deleteNote = deleteNote;
