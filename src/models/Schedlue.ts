import { model, Schema } from "mongoose";
import { days } from "../middlewares/validate";

const SchedlueSchema = new Schema(
  {
    day: {
      type: String,
      required: [true, "El dia es requerido"],
      uppercase: true,
      enum: days,
      default: "LUNES",
    },
    schedlue: {
      type: [String],
      required: [true, "El horario es requerido"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "El usuario es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

SchedlueSchema.methods.toJSON = function () {
  const { __v, user, createdAt, updatedAt, ...data } = this.toObject();
  return data;
};

export default model("schedlue", SchedlueSchema);
