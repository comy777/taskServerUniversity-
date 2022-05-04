import { Schema, model } from "mongoose";

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "lesson",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    state: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      image: {
        url: String,
      },
      default: [],
    },
  },
  { timestamps: true }
);

NoteSchema.methods.toJSON = function () {
  const { __v, created, state, user, lesson, ...data } = this.toObject();
  return data;
};

export default model("note", NoteSchema);
