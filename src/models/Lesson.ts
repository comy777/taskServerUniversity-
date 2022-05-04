import { Schema, model } from "mongoose";

const LessonSchema = new Schema(
  {
    lesson: {
      type: String,
      uppercase: true,
      required: [true, "Nombre requerido"],
    },
    state: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nrc: {
      type: Number,
      required: [true, "NRC requerido"],
    },
    teacher: {
      type: String,
      default: "",
      uppercase: true,
    },
    schedlue: {
      type: Array,
      default: [{ day: String, hours: String }],
    },
  },
  {
    timestamps: true,
  }
);

LessonSchema.methods.toJSON = function () {
  const { __v, created, state, user, ...data } = this.toObject();
  return data;
};

export default model("lesson", LessonSchema);
