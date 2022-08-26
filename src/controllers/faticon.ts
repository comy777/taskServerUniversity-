import { Request, Response } from "express";
import moment from "moment";
import { appFaticonApi } from "../axios/config";
import Token from "../models/Token";
import { FaticonAPIResponse, Icons } from "../interfaces/interfaces";
import {
  TokenResponse,
  TokenFaticon,
  TokenFaticonResponse,
} from "../interfaces/interfaces";

const saveTokenStorage = async () => {
  const dataToken = await getTokenFaticon();
  const tokenSave = new Token(dataToken);
  await tokenSave.save();
  return tokenSave;
};

const getTokenFaticon = async (): Promise<TokenFaticon> => {
  const url = "app/authentication";
  const data = { apikey: process.env.API_FATICON };
  const resp = await appFaticonApi.post<TokenFaticonResponse>(url, data);
  const { token, expires } = resp.data.data;
  const fechaActual = moment();
  const dataResp = { token, expires, created: fechaActual };
  return dataResp;
};

const validateTokenFaticon = async (data: TokenResponse) => {
  const { created } = data;
  const fechaActual = moment();
  const diferenciaHoras = moment(created).diff(fechaActual, "minutes");
  if (diferenciaHoras > 50) {
    console.log("Refrescar token");
    const { _id } = data;
    const dataToken = getTokenFaticon();
    const resp = await Token.findByIdAndUpdate<TokenResponse>(_id, dataToken, {
      new: true,
    });
    if (!resp) return [data];
    return [resp];
  }
  return [data];
};

const tokenStorageData = async (q: string): Promise<Icons> => {
  let tokenStorage = await Token.find<TokenResponse>();
  if (tokenStorage.length === 0) {
    tokenStorage = await saveTokenStorage();
  } else {
    tokenStorage = await validateTokenFaticon(tokenStorage[0]);
  }
  const { token } = tokenStorage[0];
  const { data } = await appFaticonApi.get<Icons>(`search/icons?q=${q}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getIcons = async (req: Request, res: Response) => {
  const { q } = req.params;
  const data = await tokenStorageData(q);
  const { data: dataIcons } = data;
  return res.send({ icons: dataIcons[0] });
};

export const getIconsFile = async (query: string) => {
  const data = await tokenStorageData(query);
  const { data: dataIcons } = data;
  return dataIcons[0].images["512"];
};
