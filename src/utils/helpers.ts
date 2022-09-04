import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { getIconsFile } from "../controllers/faticon";
import { storage } from "../firebase/config";
import Folder from "../models/Folder";
import Lesson from "../models/Lesson";
import User from "../models/User";

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

export const validateFolderById = async (
  id: string,
  user: string
): Promise<ValidateUser> => {
  const validate = await Folder.findById(id);
  if (!validate) return { error: "Carpeta no registrada" };
  if (!validate.state) return { error: "Carpeta no registrada" };
  if (validate.user.toString() !== user)
    return { error: "No tiene permisos para modificar esta carpeta" };
  return { id: validate._id };
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
  folder?: string
) => {
  const { originalname, buffer } = file;
  const extensionSplit = originalname.split(".");
  const extension = extensionSplit[extensionSplit.length - 1];
  const id = v4();
  const refFile = folder
    ? `Task University/${user}/${lesson}/${folder}/${id}.${extension}`
    : `Task University/${user}/${lesson}/${id}.${extension}`;
  try {
    const storageRef = ref(storage, refFile);
    await uploadBytes(storageRef, buffer);
    const image = await getIconsFile(extension);
    const url = await getDownloadURL(storageRef);
    const data = {
      filename: originalname,
      file: url,
      user,
      lesson,
      refFile: storageRef.fullPath,
      type: extension,
      image,
      folder: folder ? folder : "",
    };
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
