import cloudinary from "cloudinary";
import fs from "fs";
import { Schedule, ScheduleResponse } from "../interfaces/interfaces";
import SchedlueModel from "../models/Schedlue";
cloudinary.v2.config(process.env.CLOUDINARY_URL);

interface Props {
  item: ScheduleResponse;
  index: number;
}

export const uploadImageCloudinary = async (image: any) => {
  const extensionsValid = ["png", "jpg", "jpeg"];
  const { originalname, path } = image;
  const nameExtension = originalname.split(".");
  const extension = nameExtension[nameExtension.length - 1];
  if (!extensionsValid.includes(extension)) return;
  const url = await cloudinary.v2.uploader.upload(path, {
    upload_preset: process.env.UPLOAD_PRESET,
  });
  await fs.unlinkSync(path);
  return url;
};

export const deleteImage = async (id: string) => {
  const public_id = id.trim();
  try {
    await cloudinary.v2.uploader.destroy(`Notes/${public_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveSchedlueLesson = async (
  schedlue: Schedule[],
  user: string
) => {
  if (schedlue.length === 0) return;
  schedlue.forEach(async (item, i) => {
    const { day, hours } = item;
    const query = { user, day };
    const dataSchedule: ScheduleResponse[] =
      await SchedlueModel.find<ScheduleResponse>(query);
    if (dataSchedule.length > 0) {
      const { _id, schedlue } = dataSchedule[0];
      if (schedlue.includes(hours)) return;
      await SchedlueModel.findByIdAndUpdate(_id, {
        day,
        schedlue: [...schedlue, hours],
      });
    } else {
      const saveSchedlue = new SchedlueModel({ day, schedlue: hours, user });
      await saveSchedlue.save();
    }
  });
};

export const deleteSchedlueLesson = async (
  schedlue: Schedule[],
  user: string
) => {
  const query = { user };
  const data = await SchedlueModel.find<ScheduleResponse>(query);
  data.forEach((item) => {
    schedlue.forEach(async (j) => {
      if (item.day === j.day.toUpperCase()) {
        const { hours } = j;
        const { schedlue, _id } = item;
        if (schedlue.includes(hours)) {
          const resp = schedlue.filter((i) => i !== hours);
          if (resp.length === 0) {
            await SchedlueModel.findByIdAndDelete(_id);
            return;
          }
          await SchedlueModel.findByIdAndUpdate(_id, { schedlue: resp });
        }
      }
    });
  });
};

export const orderSchedule = async (
  data: ScheduleResponse[],
  user: string
): Promise<ScheduleResponse[]> => {
  let bandera = false;
  let arr: Props[] = [];
  data.forEach(async (item) => {
    const { _id, schedlue } = item;
    if (schedlue) {
      if (schedlue.length === 0) {
        await SchedlueModel.findByIdAndDelete(_id);
        bandera = true;
      }
    }
  });
  if (bandera) {
    const dataApi = await SchedlueModel.find<ScheduleResponse>({ user });
    const dataNew = dataSchedule(dataApi);
    arr = dataNew;
  } else {
    const dataNew = dataSchedule(data);
    arr = dataNew;
  }
  const orden = arr.sort((a: Props, b: Props) => {
    if (a.index < b.index) return -1;
    return 1;
  });
  const schedlue = orden.map((data) => {
    const { item } = data;
    const { _id, day, schedlue } = item;
    return { _id, day, schedlue };
  });
  return schedlue;
};

const dataSchedule = (data: ScheduleResponse[]): Props[] => {
  const arr: Props[] = [];
  data.forEach((item, i) => {
    if (item.day === "LUNES") {
      arr[i] = { item, index: 0 };
      return;
    }
    if (item.day === "MARTES") {
      arr[i] = { item, index: 1 };
      return;
    }
    if (item.day === "MIERCOLES") {
      arr[i] = { item, index: 2 };
      return;
    }
    if (item.day === "JUEVES") {
      arr[i] = { item, index: 3 };
      return;
    }
    if (item.day === "VIERNES") {
      arr[i] = { item, index: 4 };
      return;
    }
    if (item.day === "SABADO") {
      arr[i] = { item, index: 5 };
      return;
    }
  });
  return arr;
};
