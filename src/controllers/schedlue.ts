import { Request, Response } from "express";
import Schedlue from "../models/Schedlue";
import { ScheduleResponse } from "../interfaces/interfaces";
import { orderSchedule } from "../utils/upload";

export const getSchedlue = async (req: Request, resp: Response) => {
  const user = req.user;
  const query = { user };
  const data = await Schedlue.find<ScheduleResponse>(query);
  const schedlue = await orderSchedule(data, user);
  return resp.send({ schedlue });
};

export const saveSchedlue = async (req: Request, resp: Response) => {
  const user = req.user;
  const { day } = req.body;
  const query = { day, user };
  const schedlue = await Schedlue.findOne(query);
  if (schedlue)
    return resp.send({ error: "El dia ya se encuentra registrado" });
  const data = new Schedlue(req.body);
  data.day = day.toUpperCase();
  data.user = user;
  try {
    const dataSave = await data.save();
    return resp.send({ schedlue: dataSave });
  } catch (error) {
    console.log(error);
    return resp.send({ error: "Error del servidor" });
  }
};
export const updateSchedlue = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = req.user;
  const { day, ...data } = req.body;
  const schedlueData = await Schedlue.findById(id);
  if (!schedlueData)
    return resp.send({ error: "El dia no se encuentra registrado" });
  if (schedlueData.user.toString() !== user) {
    return resp.send({
      error: "No tiene permisos para actualizar este horario",
    });
  }
  try {
    const dataSave = await Schedlue.findByIdAndUpdate(id, data, { new: true });
    if (dataSave.schedlue.length === 0) {
      const { _id } = dataSave;
      await Schedlue.findByIdAndDelete(_id);
      return resp.send({ schedlue: [] });
    }
    return resp.send({ schedlue: dataSave });
  } catch (error) {
    console.log(error);
    return resp.send({ error: "Error del servidor" });
  }
};

export const deleteSchedlue = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = req.user;
  const schedlue = await Schedlue.findById(id);
  if (!schedlue)
    return resp.send({ error: "El dia no se encuentra registrado" });
  if (schedlue.user.toString() !== user) {
    return resp.send({
      error: "No tiene permisos para eliminar este horario",
    });
  }
  try {
    await Schedlue.findByIdAndDelete(id);
    return resp.send({ msg: "Horario eliminado" });
  } catch (error) {
    console.log(error);
    return resp.send({ error: "Error del servidor" });
  }
};
