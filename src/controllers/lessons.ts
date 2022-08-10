import { Response, Request } from "express";
import Lesson from "../models/Lesson";
import Schedlue from "../models/Schedlue";
import { LessonResponse } from "../interfaces/interfaces";
import { deleteSchedlueLesson, saveSchedlueLesson } from "../utils/upload";

export const getLessons = async (req: Request, res: Response) => {
  const user = req.user;
  const query = { user, state: true };
  const lessons = await Lesson.find(query);
  if (lessons.length === 0) {
    const data = await Schedlue.find({ user });
    if (data.length > 0) {
      data.forEach(async (item) => {
        await Schedlue.findByIdAndDelete(item._id);
      });
    }
  }
  return res.send({ lessons });
};

export const saveLesson = async (req: Request, res: Response) => {
  const id = req.user;
  const lessonName = await Lesson.findOne({
    lesson: req.body.lesson,
    state: true,
  });
  if (lessonName) return res.send({ error: "La clase ya esta registrada" });
  const lessonNrc = await Lesson.findOne({ nrc: req.body.nrc, state: true });
  if (lessonNrc) return res.send({ error: "La clase ya esta registrada" });
  const lesson = new Lesson(req.body);
  lesson.user = id;
  try {
    const data: LessonResponse = await lesson.save();
    const { schedlue } = data;
    await saveSchedlueLesson(schedlue, id);
    return res.send({ lesson });
  } catch (error) {
    console.log(error);
  }
};

export const editLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const lesson: LessonResponse | null =
    await Lesson.findById<LessonResponse | null>(id);
  if (!lesson) return res.send({ error: "La clase no existe" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "No puede modificar esta clase" });
  try {
    const resp = await Lesson.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    const { schedlue } = req.body;
    if (schedlue.length === 0) {
      if (lesson.schedlue.length > 0) {
        await deleteSchedlueLesson(lesson.schedlue, user);
      }
    } else {
      if (schedlue.length < lesson.schedlue.length) {
        await deleteSchedlueLesson(lesson.schedlue, user);
      }
      await saveSchedlueLesson(schedlue, user);
    }
    return res.send({ lesson: resp });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const lesson = await Lesson.findById<LessonResponse>(id);
  if (!lesson) return res.send({ error: "La clase no existe" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "No puede modificar esta clase" });
  const { schedlue } = lesson;
  await deleteSchedlueLesson(schedlue, user);
  try {
    await Lesson.findOneAndUpdate({ _id: id }, { state: false });
    return res.send({ msg: "Clase eliminada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
