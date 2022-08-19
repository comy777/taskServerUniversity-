import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Note from "../models/Note";
import Task from "../models/Task";

const ObjectId = require("mongoose").Types;

export const searchTerm = async (req: Request, res: Response) => {
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
  const lessons = await Lesson.find(search).limit(5);
  const notes = await Note.find(search).limit(5);
  const tasks = await Task.find(search).limit(5);
  const results = [...lessons, ...notes, ...tasks];
  res.send(results);
};
