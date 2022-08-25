import { Schema, model } from "mongoose";

const MeetSchema = new Schema(
  {
    meet: {
      type: String,
      required: [true, "El nombre de la reunion es requerido"],
    },
    date_meet: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    start_time: {
      type: String,
      required: [true, "La hora de inicio es requerida"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "El usuario es requerido"],
    },
    link: {
      type: String,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

MeetSchema.index({ meet: "text", date_meet: "text" });

MeetSchema.methods.toJSON = function () {
  const { __v, created, state, user, createdAt, updatedAt, ...data } =
    this.toObject();
  return data;
};

export default model("meet", MeetSchema);
