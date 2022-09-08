import { Request, Response } from "express";
import File from "../models/File";
import Lesson from "../models/Lesson";
import { deleteImage, uploadImageCloudinary } from "../utils/upload";
import {
  uploadFileFirebase,
  validateFolderById,
  deleteFileFirebase,
} from "../utils/helpers";
import Folder from "../models/Folder";
import { FolderProps } from "../interfaces/interfaces";

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
  if (!req.file) return res.send({ error: "No hay archivos para subir" });
  const user = req.user;
  const { lesson, folder } = req.params;
  let folderName: string | undefined = undefined;
  let folderID: string | undefined = undefined;
  let dataFolder: FolderProps | undefined = undefined;
  if (folder) {
    const validate = await validateFolderById(folder, user);
    if (validate.error) return res.send({ error: validate.error });
    const folderData = await Folder.findById(folder);
    folderName = folderData.folder;
    folderID = folderData._id;
    if (folderName && folderID) dataFolder = { folder: folderName, folderID };
  }
  const validateLesson = await Lesson.findById(lesson);
  if (!validateLesson) return res.send({ error: "La clase no existe" });
  if (validateLesson.user.toString() !== user)
    return res.send({ error: "No tiene permiso" });
  const file = req.file;
  try {
    const data = await uploadFileFirebase(file, user, lesson, dataFolder);
    if (data) {
      const fileData = new File(data);
      await fileData.save();
      if (folder) {
        if (folderName) {
          const query = { lesson, user, state: true, folder: folderName };
          const files = await File.find(query);
          const filesUpdated = files.map((item) => ({ file: item._id }));
          await Folder.findByIdAndUpdate(folder, {
            files: filesUpdated,
          });
        }
      }
      return res.send({ file: fileData });
    }
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error al subir archivo" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validateFile = await File.findById(id);
  if (!validateFile) return res.send({ error: "El archivo no existe" });
  if (validateFile.user.toString() !== user)
    return res.send({ error: "No tiene permisos" });
  try {
    await deleteFileFirebase(validateFile.refFile);
    await File.findByIdAndUpdate(id, { state: false });
    if (validateFile.folderID) {
      const idFolder = validateFile.folderID;
      const folder = await Folder.findById(idFolder);
      if (folder) {
        const files = folder.files.filter(
          (item: any) => item.file.toString() !== id
        );
        await Folder.findByIdAndUpdate(idFolder, { files });
      }
    }
    return res.send({ msg: "Archivo eliminado" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validateFile = await File.findById(id);
  if (!validateFile) return res.send({ error: "Archivo no encontrado" });
  if (validateFile.user.toString() !== user)
    return res.send({ error: "No tiene permisos" });
  try {
    const file = await File.findByIdAndUpdate(id, req.body, { new: true });
    return res.send({ file });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
