import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
  token: {
    type: String,
    required: [true, "Token requerido"],
  },
  expires: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: [true, "Fecha de creacion requerida"],
  },
});

export default model("token", TokenSchema);
