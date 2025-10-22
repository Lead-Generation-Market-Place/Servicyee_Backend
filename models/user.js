import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phone: { type: String, required: true},
  password: { type: String, required: true },
});

export const User = model("User", UserSchema);