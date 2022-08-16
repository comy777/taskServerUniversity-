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
