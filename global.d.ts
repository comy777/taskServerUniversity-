namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    SECRET_KEY: string;
    CLOUDINARY_URL: string;
    UPLOAD_PRESET: string;
    PASSWORD_EMAIL: string;
    API_FATICON: string;
  }
}

namespace Express {
  interface Request {
    user: string;
  }
}
