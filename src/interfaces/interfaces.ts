import { Schema } from "mongoose";
export interface User {
  _id: string;
  email: string;
  image?: string;
  verify: boolean;
}

export interface ImageCloudinary {
  tempFilePath: string;
  name: string;
}

export interface ScheduleResponse {
  day: string;
  schedlue: string[];
  _id: string;
}

export interface LessonResponse {
  _id: string;
  lesson: string;
  nrc: string;
  teacher: string;
  schedlue: Schedule[];
  classroom: string;
  user: string;
}

export interface LessonSave {
  lesson: string;
  nrc: string;
  teacher: string;
  schedlue: Schedule[];
  classroom: string;
  user: string;
}

export interface Schedule {
  day: string;
  hours: string;
}

// Generated by https://quicktype.io

export interface MeetInterface {
  _id: string;
  meet: string;
  date_meet: string;
  start_time: string;
  link?: string;
}

export interface TokenResponse {
  token: string;
  expires: string;
  created: Date;
  _id: string;
}

export interface TokenFaticon {
  token: string;
  expires: number;
  created: any;
}

export interface TokenFaticonResponse {
  data: TokenFaticon;
}

export interface FaticonAPIResponse {
  icons: Icons;
}

export interface Icons {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  description: string;
  colors: string;
  color: Color;
  shape: Shape;
  family_id: number;
  family_name: string;
  team_name: TeamName;
  added: number;
  pack_id: number;
  pack_name: string;
  pack_items: number;
  tags: string;
  equivalents: number;
  images: { [key: string]: string };
}

export enum Color {
  Black = "black",
  Color = "color",
  Empty = "",
  Gradient = "gradient",
}

export enum Shape {
  Empty = "",
  Fill = "fill",
  LinealColor = "lineal-color",
  Outline = "outline",
}

export enum TeamName {
  Freepik = "Freepik",
}

export interface Metadata {
  page: number;
  count: number;
  total: number;
}

export interface GetFileResponse {
  files: File[];
}

export interface FileReponse {
  _id: string;
  filename: string;
  file: string;
  lesson: string;
  folder: string;
  refFile: string;
  type: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderFile {
  file: string;
}

export interface FolderProps {
  folder: string;
  folderID: string;
}
