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
    type: {
      type: String,
      default: "note",
    },
  },
  { timestamps: true }
);

NoteSchema.index({ title: "text", body: "text" });

NoteSchema.methods.toJSON = function () {
  const { __v, created, state, user, lesson, ...data } = this.toObject();
  return data;
};

export default model("note", NoteSchema);
