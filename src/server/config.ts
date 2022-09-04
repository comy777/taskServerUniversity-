import express from "express";
import path from "path";
import cors from "cors";
import dbConection from "../database/config";
import authRouter from "../router/auth";
import lessonsRouter from "../router/lessons";
import notesRouter from "../router/notes";
import taskRouter from "../router/task";
import uploadRouter from "../router/upload";
import schedlueRouter from "../router/schedlue";
import searchRouter from "../router/search";
import meetRouter from "../router/meet";
import faticonRouter from "../router/faticon";
import folderRouter from "../router/folder";

class Server {
  public app: express.Application;
  public port: number;
  public path: {
    auth: string;
    lessons: string;
    notes: string;
    task: string;
    upload: string;
    schedlue: string;
    search: string;
    meets: string;
    faticon: string;
    folders: string;
  };
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 1337;
    this.path = {
      auth: "/auth",
      lessons: "/lessons",
      notes: "/notes",
      task: "/tasks",
      upload: "/upload",
      schedlue: "/schedlue",
      search: "/search",
      meets: "/meets",
      faticon: "/faticon",
      folders: "/folders",
    };

    //Database
    this.db();

    //middlewares
    this.middlewares();

    //routes
    this.routes();
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server port: ${this.port}`);
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
    // this.app.use(
    //   fileUpload({
    //     useTempFiles: true,
    //     tempFileDir: "/tmp/",
    //     createParentPath: true,
    //   })
    // );
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes = () => {
    this.app.use(this.path.auth, authRouter);
    this.app.use(this.path.lessons, lessonsRouter);
    this.app.use(this.path.notes, notesRouter);
    this.app.use(this.path.task, taskRouter);
    this.app.use(this.path.upload, uploadRouter);
    this.app.use(this.path.schedlue, schedlueRouter);
    this.app.use(this.path.search, searchRouter);
    this.app.use(this.path.meets, meetRouter);
    this.app.use(this.path.faticon, faticonRouter);
    this.app.use(this.path.folders, folderRouter);
  };
}

export default Server;
