import { Request, Response } from "express";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase/config";
import File from "../models/File";
import Lesson from "../models/Lesson";
import { deleteImage, uploadImageCloudinary } from "../utils/upload";

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) return res.send({ error: "No hay imagenes para subir" });
  try {
    const image = req.file;
    const resp = await uploadImageCloudinary(image);
    if (!resp) return res.send({ error: "Error al subir imagen" });
    const { secure_url } = resp;
    return res.send({ url: secure_url });
  } catch (error) {
    console.log(error);
    res.send({
      error: "Error del servidor",
    });
  }
};

export const deleteImageUpload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resp = await deleteImage(id);
    if (!resp)
      res.send({ error: "Error al eliminar la imagen, o imagen no existe" });
    return res.send({ msg: "Imagen Eliminada" });
  } catch (error) {
    console.log(error);
    res.send({
      error: "Error del servidor",
    });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  const user = req.user;
  const { lesson } = req.params;
  const validateLesson = await Lesson.findById(lesson);
  if (!validateLesson)
    return res.send({ error: "La clase no se encuentra registrada" });
  const query = { lesson, user, state: true };
  const files = await File.find(query);
  return res.send({ files });
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) return res.send({ error: "No hay archivos para subirl" });
  const user = req.user;
  const { lesson } = req.params;
  const validateLesson = await Lesson.findById(lesson);
  if (!validateLesson) return res.send({ error: "La clase no existe" });
  if (validateLesson.user.toString() !== user)
    return res.send({ error: "No tiene permiso" });
  const file = req.file;
  const { originalname } = file;
  const extensionSplit = originalname.split(".");
  const extension = extensionSplit[extensionSplit.length - 1];
  const { buffer } = file;
  const id = v4();
  try {
    const storageRef = ref(
      storage,
      `Task University/${user}/${lesson}/${id}.${extension}`
    );
    await uploadBytes(storageRef, buffer);
    const url = await getDownloadURL(storageRef);
    const data = {
      filename: originalname,
      file: url,
      user,
      lesson,
      refFile: storageRef.fullPath,
    };
    const fileData = new File(data);
    await fileData.save();
    return res.send({ file: fileData });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error al subir archivo" });
  }
};

export const deleteFileFirebase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validateFile = await File.findById(id);
  if (!validateFile) return res.send({ error: "El archivo no existe" });
  if (validateFile.user.toString() !== user)
    return res.send({ error: "No tiene permisos" });
  const storageRef: StorageReference = ref(storage, validateFile.refFile);
  try {
    await deleteObject(storageRef);
    const { _id } = validateFile;
    await File.findByIdAndUpdate(_id, { state: false });
    return res.send({ msg: "Archivo eliminado" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
