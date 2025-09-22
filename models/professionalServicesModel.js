import mongoose from 'mongoose';
const PricingType = ['fixed', 'hourly'];
// In professionalServicesModel.js
const professionalServicesSchema = new mongoose.Schema({
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Services',},
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  maximum_price: Number,
  minimum_price: Number,
  service_status: { type: Boolean, default: true },
  description: String,
  service_availability: { type: Boolean, default: true },
  pricing_type: { type: String, enum: PricingType, default: 'fixed' },
  completed_tasks: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false, collection: 'professional_services' }); // Changed collection name

export default mongoose.model('professional_services', professionalServicesSchema);