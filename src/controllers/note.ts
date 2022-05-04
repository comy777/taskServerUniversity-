import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Note from "../models/Note";
import { deleteImage } from "../utils/upload";

export const getNotes = async (req: Request, res: Response) => {
  const id = req.user;
  const { lesson } = req.params;
  const lessonValid = await Lesson.findById(lesson);
  if (!lessonValid) return res.send({ error: "La clase no existe" });
  const query = { state: true, user: id, lesson };
  const notes = await Note.find(query);
  return res.send({ notes });
};

export const saveNote = async (req: Request, res: Response) => {
  const id = req.user;
  const { lesson } = req.params;
  const lessonValid = await Lesson.findById(lesson);
  if (!lessonValid) return res.send({ error: "La clase no esta registrada" });
  if (!lessonValid.state)
    return res.send({ error: "La clase no esta registrada" });
  const note = new Note(req.body);
  note.user = id;
  note.lesson = lesson;
  try {
    await note.save();
    return res.send({ note });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const editNote = async (req: Request, res: Response) => {
  const id = req.user;
  const { note_id } = req.params;
  const noteValid = await Note.findById(note_id);
  if (!noteValid.state)
    return res.send({ error: "La nota no esta registrada" });
  if (noteValid.user.toString() !== id)
    return res.send({ error: "No tiene permisos para eliminar la nota" });
  try {
    const note = await Note.findOneAndUpdate({ _id: note_id }, req.body, {
      new: true,
    });
    return res.send({ note });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const id = req.user;
  const { note_id } = req.params;
  const noteValid = await Note.findById(note_id);
  if (!noteValid) return res.send({ error: "Nota no encontrada" });
  if (!noteValid.state)
    return res.send({ error: "La nota no esta registrada" });
  if (noteValid.user.toString() !== id)
    return res.send({ error: "No tiene permisos para eliminar la nota" });
  const { images } = noteValid;
  if (images.length > 0) {
    images.map(async (item: any) => {
      const idImage = item.uri.split("/");
      let data = idImage[idImage.length - 1];
      data = data.split(".");
      const resp = await deleteImage(data[0]);
      if (!resp) return res.send({ error: "Error del servidor" });
    });
  }
  try {
    await Note.findOneAndUpdate({ _id: note_id }, { state: false, images: [] });
    return res.send({ msg: "Nota eliminada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
