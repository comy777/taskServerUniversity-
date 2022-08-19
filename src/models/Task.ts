import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      uppercase: true,
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
    complete: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      image: {
        url: String,
      },
      default: [],
    },
    dayLimit: {
      type: Date,
      default: Date.now(),
    },
    type: {
      type: String,
      default: "task",
    },
  },
  { timestamps: true }
);

TaskSchema.index({ title: "text", body: "text" });

TaskSchema.methods.toJSON = function () {
  const { __v, created, state, user, ...data } = this.toObject();
  return data;
};

export default model("task", TaskSchema);
