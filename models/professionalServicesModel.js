import mongoose from "mongoose";

const PricingType = ["fixed", "hourly", "Project Based", "custom"];
const professionalServiceSchema = new mongoose.Schema({
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
  service_name: { type: String, index: true },
  location_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
  maximum_price: {type:Number, default: 0},
  minimum_price: {type: Number, default: 0},
  service_status: { type: Boolean, default: true },
  description: String,
  pricing_type: { type: String, enum: PricingType, default: "fixed" },
  completed_tasks: { type: Number, default: 0 },
  question_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
}, { timestamps: true, versionKey: false, collection: "professional_services" });

// professionalServiceSchema.index({ service_name: "text", professional_id: 1, service_status: 1 });

export default mongoose.model("ProfessionalService", professionalServiceSchema);
