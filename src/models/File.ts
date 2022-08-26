import { Schema, model } from "mongoose";

const FileSchema = new Schema(
  {
    filename: {
      type: String,
      required: [true, "El nombre del archivo es requerido"],
    },
    file: {
      type: String,
      required: [true, "La url del archivo es requerida"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "El usuario es requerido"],
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "lesson",
      required: [true, "La clase es requerida"],
    },
    state: {
      type: Boolean,
      default: true,
    },
    refFile: {
      type: String,
      required: [true, "La referencia es requerida"],
    },
    type: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

FileSchema.index({ filename: "text", file: "text" });

FileSchema.methods.toJSON = function () {
  const { __v, state, user, ...data } = this.toObject();
  return data;
};

export default model("file", FileSchema);
