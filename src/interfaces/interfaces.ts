export interface User {
  _id: string;
  email: string;
  image?: string;
}

export interface ImageCloudinary {
  tempFilePath: string;
  name: string;
}

export interface ScheduleResponse {
  day: string;
  schedlue: string[];
  classroom: string;
  _id: string;
}

export interface LessonResponse {
  lesson: string;
  nrc: string;
  teacher: string;
  schedlue: Schedule[];
  classroom: string;
  user: string;
}

interface Schedule {
  day: string;
  hours: string;
}
