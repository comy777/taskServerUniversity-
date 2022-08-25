import { Request, Response } from "express";
import moment from "moment";
import { MeetInterface } from "../interfaces/interfaces";
import Meet from "../models/Meet";

const deleteMeetById = async (id: string) => {
  const validateMeet = await Meet.findById(id);
  if (!validateMeet) return;
  await Meet.findByIdAndUpdate(id, { state: false });
};

export const getMeets = async (req: Request, res: Response) => {
  const user = req.user;
  const query = { user, state: true };
  let meets: MeetInterface[] = await Meet.find<MeetInterface>(query);
  let bandera = false;
  const fechaActual = moment();
  meets.forEach(async (item) => {
    const { date_meet, start_time, _id } = item;
    const diferenciaDias = moment(date_meet).diff(fechaActual, "days");
    if (diferenciaDias < 0) {
      bandera = true;
      await deleteMeetById(_id);
      return;
    }
    const hora = moment(start_time, "HH:mm a");
    const diferenciaHoras = moment(hora).diff(fechaActual, "hours");
    if (diferenciaHoras < 0) {
      if (!bandera) bandera = true;
      await deleteMeetById(_id);
      return;
    }
  });
  if (bandera) meets = await Meet.find<MeetInterface>(query);
  return res.send({ meets });
};

export const saveMeet = async (req: Request, res: Response) => {
  const user = req.user;
  const { meet, link } = req.body;
  const meetByName: MeetInterface | null = await Meet.findOne<MeetInterface>({
    user,
    meet,
    state: true,
  });
  if (meetByName)
    return res.send({ error: "La reunion ya se encuentra registrada" });
  if (link) {
    const meetByLink: MeetInterface | null = await Meet.findOne<MeetInterface>({
      user,
      link,
      state: true,
    });
    if (meetByLink)
      return res.send({
        error: "La reunion ya se encuentra registrada por el link",
      });
  }
  try {
    const meetData = new Meet(req.body);
    meetData.user = user;
    const saveMeet = await meetData.save();
    return res.send({ meet: saveMeet });
  } catch (error) {
    res.send({ error: "Error del servidor" });
    console.log(error);
  }
};

export const updateMeet = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const meetById = await Meet.findById(id);
  if (!meetById)
    return res.send({ error: "La reunion no se encuentra registrada" });
  if (meetById.user.toString() !== user)
    return res.send({
      error: "No tiene permisos para modificar la reunion",
    });
  try {
    const { meet, link, start_time, date_meet } = req.body;
    const data = {
      meet: meet ? meet : meetById.meet,
      link: link ? link : meetById.link,
      start_time: start_time ? start_time : meetById.start_time,
      date_meet: date_meet ? date_meet : meetById.date_meet,
    };
    const updateMeet = await Meet.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.send({ meet: updateMeet });
  } catch (error) {
    res.send({ error: "Error del servidor" });
    console.log(error);
  }
};

export const deleteMeet = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const meetById = await Meet.findById(id);
  if (!meetById)
    return res.send({ error: "La reunion no se encuentra registrada" });
  if (meetById.user.toString() !== user)
    return res.send({
      error: "No tiene permisos para modificar la reunion",
    });
  try {
    await Meet.findByIdAndUpdate(id, { state: false });
    return res.send({ msg: "Reunion eliminada" });
  } catch (error) {
    res.send({ error: "Error del servidor" });
    console.log(error);
  }
};
