import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
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
  created: {
    type: Date,
    default: Date.now(),
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
});

TaskSchema.methods.toJSON = function () {
  const { __v, created, state, user, ...data } = this.toObject();
  return data;
};

export default model("task", TaskSchema);
