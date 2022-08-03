import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const days = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
];

export const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ error: errors.array()[0].msg });
  }
  next();
};

export const validateDay = (day: string) => {
  const data = day.toUpperCase();
  if (!days.includes(data)) {
    throw new Error(`El dia ${day} no es valido`);
  }
  return true;
};
