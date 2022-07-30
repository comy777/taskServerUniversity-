import { Response, Request } from "express";
import Lesson from "../models/Lesson";

export const getLessons = async (req: Request, res: Response) => {
  const user = req.user;
  const query = { user, state: true };
  const lessons = await Lesson.find(query);
  return res.send({ lessons });
};

export const saveLesson = async (req: Request, res: Response) => {
  const id = req.user;
  const lessonName = await Lesson.findOne({ lesson: req.body.lesson });
  if (lessonName) return res.send({ error: "La clase ya esta registrada" });
  const lessonNrc = await Lesson.findOne({ nrc: req.body.nrc });
  if (lessonNrc) return res.send({ error: "La clase ya esta registrada" });
  const lesson = new Lesson(req.body);
  lesson.user = id;
  try {
    await lesson.save();
    return res.send({ lesson });
  } catch (error) {
    console.log(error);
  }
};

export const editLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const lesson = await Lesson.findById(id);
  if (!lesson) return res.send({ error: "La clase no existe" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "No puede modificar esta clase" });
  try {
    const resp = await Lesson.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    return res.send({ lesson: resp });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const lesson = await Lesson.findById(id);
  if (!lesson) return res.send({ error: "La clase no existe" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "No puede modificar esta clase" });
  try {
    await Lesson.findOneAndUpdate({ _id: id }, { state: false });
    return res.send({ msg: "Clase eliminada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
