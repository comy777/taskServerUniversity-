import { Request, Response } from "express";
import { uploadImageCloudinary } from "../utils/upload";

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.send({ msg: "No files were uploaded." });
  }
  if (!req.files.image) {
    return res.send({ msg: "No hay imagenes para subir" });
  }
  try {
    const { image } = req.files;
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
