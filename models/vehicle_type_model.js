import { Schema, model } from "mongoose";

const VehicleTypeSchema = new Schema({
  vehicle_type: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false,
  collection: "vehicle_type"
});

export default model("VehicleType", VehicleTypeSchema);
