import { Schema, model } from "mongoose";

const FolderSchema = new Schema(
  {
    folder: {
      type: String,
      required: [true, "El nombre de la carpeta es obligatorio"],
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "lesson",
      required: [true, "LA clase es requerida"],
    },
    files: {
      type: Array,
      file: {
        type: Schema.Types.ObjectId,
        ref: "file",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

FolderSchema.methods.toJSON = function () {
  const { __v, created, state, user, ...data } = this.toObject();
  return data;
};

export default model("folder", FolderSchema);
