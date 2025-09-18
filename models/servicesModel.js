import mongoose from "mongoose";

const serviceTypes = ['active', 'deactive'];

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: serviceTypes, default: 'active' },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategories',
    required: true
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: true
  }
});

export default mongoose.model('Service', ServiceSchema);
