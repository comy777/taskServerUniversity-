import { Request, Response } from "express";
import Folder from "../models/Folder";
import { FileReponse } from "../interfaces/interfaces";
import {
  validateFolderById,
  validateFolderData,
  getFilesData,
} from "../utils/helpers";
import File from "../models/File";
import { deleteObject, ref, StorageReference } from "firebase/storage";
import { storage } from "../firebase/config";
import { deleteFileFirebase } from "../utils/helpers";

export const getFoldersLesson = async (req: Request, res: Response) => {
  const user = req.user;
  const { lesson } = req.params;
  const query = { user, lesson, state: true };
  const folders = await Folder.find(query);
  return res.send({ folders });
};

export const getFilesFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validate = await validateFolderById(id, user);
  if (validate.error) return res.send({ error: validate.error });
  const files = await getFilesData(validate.folder.files);
  return res.send({ files });
};

export const addFolder = async (req: Request, res: Response) => {
  const user = req.user;
  const { lesson } = req.params;
  const { folder } = req.body;
  const validate = await validateFolderData({ user, lesson, folder });
  if (!validate)
    return res.send({ error: "La carpeta ya se encuentra registrada" });
  try {
    const data = new Folder(req.body);
    data.user = user;
    data.lesson = lesson;
    const folderSave = await data.save();
    return res.send({ folder: folderSave });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validate = await validateFolderById(id, user);
  if (validate.error) {
    return res.send({ error: validate.error });
  }
  try {
    const folderUpdate = await Folder.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.send({ folder: folderUpdate });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validate = await validateFolderById(id, user);
  if (validate.error) return res.send({ error: validate.error });
  try {
    const folder = await Folder.findByIdAndUpdate(id, { state: false });
    if (folder.files) {
      if (folder.files.length > 0) {
        folder.files.forEach(async (item: FileReponse) => {
          const { file } = item;
          const fileData = await File.findByIdAndUpdate(file, { state: false });
          await deleteFileFirebase(fileData.refFile);
        });
      }
    }
    return res.send({ msg: "Carpeta eliminada" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Error del servidor" });
  }
};
