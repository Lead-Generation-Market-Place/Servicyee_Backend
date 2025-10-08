// models/professionalServicesModel.js
import mongoose from 'mongoose';

const PricingType = ['fixed', 'hourly'];
const dayStatus = ['open', 'close'];
const professionalServicesSchema = new mongoose.Schema({
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional' },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Services' },
  maximum_price: Number,
  minimum_price: Number,
  service_status: { type: Boolean, default: true },
  description: String,
  service_availability: { type: Boolean, default: true },
  pricing_type: { type: String, enum: PricingType, default: 'fixed' },
  completed_tasks: { type: Number, default: 0 },

  business_hours: [{
    status: { type: String, enum: dayStatus },
    start_time: Date,
    end_time: Date,
    day: { type: Number, min: 0, max: 6 }
  }],


  answers: [{
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }
  }]

}, { timestamps: true, versionKey: false, collection: 'professional_services' });

export default mongoose.model('professional_services', professionalServicesSchema);
