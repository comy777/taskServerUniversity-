import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      default: "",
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, "Correo electronico requerido"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Contraseña requerida"],
      trim: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, password, state, ...data } =
    this.toObject();
  return data;
};

export default model("user", UserSchema);
