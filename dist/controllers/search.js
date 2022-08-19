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
exports.searchTerm = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Note_1 = __importDefault(require("../models/Note"));
const Task_1 = __importDefault(require("../models/Task"));
const ObjectId = require("mongoose").Types;
const searchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { term } = req.params;
    //const esMongoId = ObjectId.isValid(term);
    // if (esMongoId) {
    //   const categoria = await Categoria.findById(termino);
    //   return res.status(200).json({
    //     results: categoria ? [categoria] : [],
    //   });
    // }
    const regex = new RegExp(term, "i");
    const search = { $text: { $search: term }, state: true, user };
    const lessons = yield Lesson_1.default.find(search).limit(5);
    const notes = yield Note_1.default.find(search).limit(5);
    const tasks = yield Task_1.default.find(search).limit(5);
    const results = [...lessons, ...notes, ...tasks];
    const data = [];
    results.forEach((item, i) => {
        if (item.type === "lesson") {
            data[i] = { lesson: item };
            return;
        }
        if (item.type === "note") {
            data[i] = { note: item };
            return;
        }
        if (item.type === "task") {
            data[i] = { task: item };
            return;
        }
    });
    res.send(data);
});
exports.searchTerm = searchTerm;
