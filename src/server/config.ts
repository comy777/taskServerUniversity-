import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import dbConection from "../database/config";
import authRouter from "../router/auth";
import lessonsRouter from "../router/lessons";
import notesRouter from "../router/notes";
import taskRouter from "../router/task";
import uploadRouter from "../router/upload";

class Server {
  public app: express.Application;
  public path: {
    auth: string;
    lessons: string;
    notes: string;
    task: string;
    upload: string;
  };
  constructor() {
    this.app = express();
    this.path = {
      auth: "/auth",
      lessons: "/lessons",
      notes: "/notes",
      task: "/tasks",
      upload: "/upload",
    };

    //Database
    this.db();

    //middlewares
    this.middlewares();

    //routes
    this.routes();
  }

  public start() {
    this.app.listen(() => {
      console.log(`Server port: `);
    });
  }

  public db = async () => {
    await dbConection();
  };

  private publicFolder() {
    const publicPath = path.resolve(__dirname, "../public");
    this.app.use(express.static(publicPath));
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.publicFolder();
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  private routes = () => {
    this.app.use(this.path.auth, authRouter);
    this.app.use(this.path.lessons, lessonsRouter);
    this.app.use(this.path.notes, notesRouter);
    this.app.use(this.path.task, taskRouter);
    this.app.use(this.path.upload, uploadRouter);
  };
}

export default Server;
