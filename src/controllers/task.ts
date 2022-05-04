import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Task from "../models/Task";
import { deleteImage } from "../utils/upload";

export const getTasks = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const lesson = await Lesson.findById(id);
  if (!lesson)
    return res.send({ error: "La calse no se encuentra registrada" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "Error de autentificacion" });
  const query = { lesson: id, user, state: true };
  const tasks = await Task.find(query);
  return res.send({ tasks });
};

export const saveTask = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const lesson = await Lesson.findById(id);
  if (!lesson) return res.send({ error: "La clase no existe" });
  if (lesson.user.toString() !== user)
    return res.send({ error: "No tiene permisos para agregar la tarea" });
  if (!req.body.title && !req.body.body)
    return res.send({ error: "Tarea no almacenada" });
  try {
    const task = new Task(req.body);
    task.user = user;
    task.lesson = id;
    await task.save();
    return res.send({ task });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const editTask = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const taskValid = await Task.findById(id);
  if (!taskValid) return res.send({ error: "La tarea no existe" });
  if (taskValid.user.toString() !== user)
    return res.send({ error: "No tiene permisos para agregar la tarea" });
  try {
    const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    return res.send({ task });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const taskValid = await Task.findById(id);
  if (!taskValid) return res.send({ error: "La tarea no existe" });
  if (taskValid.user.toString() !== user)
    return res.send({ error: "No tiene permisos para agregar la tarea" });
  const { images } = taskValid;
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
    await Task.findOneAndUpdate({ _id: id }, { state: false, images: [] });
    return res.send({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const taskValid = await Task.findById(id);
  if (!taskValid) return res.send({ error: "La tarea no existe" });
  if (taskValid.user.toString() !== user)
    return res.send({ error: "No tiene permisos para agregar la tarea" });
  try {
    const { complete } = taskValid;
    await Task.findOneAndUpdate(
      { _id: id },
      { complete: !complete },
      { new: true }
    );
    return res.send({ msg: "Tarea actualizada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
