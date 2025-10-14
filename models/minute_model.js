import { Schema, model } from "mongoose";

const MinuteSchema = new Schema({
  minute: { type: Number, required: true }
}, {
  timestamps: true,
  versionKey: false,
  collection: "minutes"
});

export default model("Minutes", MinuteSchema);
