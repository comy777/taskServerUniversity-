import {
  getDownloadURL,
  ref,
  uploadBytes,
  StorageReference,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { getIconsFile } from "../controllers/faticon";
import { storage } from "../firebase/config";
import Folder from "../models/Folder";
import Lesson from "../models/Lesson";
import User from "../models/User";
import { FileReponse, FolderFile, FolderProps } from "../interfaces/interfaces";
import File from "../models/File";

interface ValidateFolder {
  folder: string;
  user: string;
  lesson: string;
}

export interface ValidateUser {
  error?: string;
  id?: string;
}

export const validateUser = async (id: string) => {
  const validateUser = await User.findById(id);
  if (!validateUser) return;
  if (!validateUser.state) return;
  return true;
};

export const validateLesson = async (id: string) => {
  const validateLesson = await Lesson.findById(id);
  if (!validateLesson) return;
  return true;
};

export const validateFolderById = async (id: string, user: string) => {
  const validate = await Folder.findById(id);
  if (!validate) return { error: "Carpeta no registrada" };
  if (!validate.state) return { error: "Carpeta no registrada" };
  if (validate.user.toString() !== user)
    return { error: "No tiene permisos para modificar esta carpeta" };
  return { folder: validate };
};

export const validateFolderByName = async (
  user: string,
  lesson: string,
  folder: string
) => {
  const query = { user, lesson, folder, state: true };
  const validate = await Folder.findOne(query);
  if (validate) return;
  return true;
};

export const validateFolderData = async ({
  user,
  lesson,
  folder,
}: ValidateFolder) => {
  const validate = await validateFolderByName(user, lesson, folder);
  return validate;
};

export const uploadFileFirebase = async (
  file: Express.Multer.File,
  user: string,
  lesson: string,
  dataFolder?: FolderProps
) => {
  const { originalname, buffer } = file;
  const extensionSplit = originalname.split(".");
  const extension = extensionSplit[extensionSplit.length - 1];
  const id = v4();
  const refFile = dataFolder
    ? `Task University/${user}/${lesson}/${dataFolder.folder}/${id}.${extension}`
    : `Task University/${user}/${lesson}/${id}.${extension}`;
  try {
    const storageRef = ref(storage, refFile);
    await uploadBytes(storageRef, buffer);
    const image = await getIconsFile(extension);
    const url = await getDownloadURL(storageRef);
    const data = dataFolder
      ? {
          filename: originalname,
          file: url,
          user,
          lesson,
          refFile: storageRef.fullPath,
          type: extension,
          image,
          folder: dataFolder.folder,
          folderID: dataFolder.folderID,
        }
      : {
          filename: originalname,
          file: url,
          user,
          lesson,
          refFile: storageRef.fullPath,
          type: extension,
          image,
        };
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getFilesData = async (
  filesData: FolderFile[]
): Promise<FileReponse[]> => {
  return new Promise((resolve) => {
    let contador = 0;
    const files: FileReponse[] = [];
    if (filesData.length === 0) resolve(files);
    filesData.forEach(async (item: FolderFile) => {
      const { file } = item;
      const data = await File.findById(file);
      if (!data) return;
      files[contador] = data;
      contador += 1;
      if (contador === filesData.length) resolve(files);
    });
  });
};

export const deleteFileFirebase = async (dataRef: string) => {
  const storageRef: StorageReference = ref(storage, dataRef);
  await deleteObject(storageRef);
};
