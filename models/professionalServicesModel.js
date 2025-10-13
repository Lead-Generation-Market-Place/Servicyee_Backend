import mongoose from 'mongoose';

const PricingType = ['fixed', 'hourly', 'per_project', 'custom'];

const professionalServiceSchema = new mongoose.Schema({
<<<<<<< HEAD
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true, index: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
  location_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
=======
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
  service_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true }],
  service_name: { type: String, index: true },
  location_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
>>>>>>> 5a74447 ( Creating Professional Account First Step)
  maximum_price: Number,
  minimum_price: Number,
  service_status: { type: Boolean, default: true },
  description: String,
  pricing_type: { type: String, enum: PricingType, default: 'fixed' },
  completed_tasks: { type: Number, default: 0 },
  question_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] 
}, { timestamps: true, versionKey: false, collection: 'professional_services' });

professionalServiceSchema.index({ professional_id: 1, service_id: 1 }, { unique: true });

export default mongoose.model('ProfessionalService', professionalServiceSchema);
