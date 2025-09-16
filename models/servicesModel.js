import mongoose from "mongoose";

const serviceTypes = ['active', 'deactive'];

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: serviceTypes, default: 'active' },
});

export default mongoose.model('Service', ServiceSchema);
