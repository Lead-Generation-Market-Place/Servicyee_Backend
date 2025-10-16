import { Schema, model } from "mongoose";

const MileSchema = new Schema({
  mile: { type: Number, required: true }
}, {
  timestamps: true,
  versionKey: false,
  collection: "miles"
});

export default model("Mile", MileSchema);
