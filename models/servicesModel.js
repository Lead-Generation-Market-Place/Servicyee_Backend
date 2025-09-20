import mongoose from 'mongoose';

const PricingType = ['fixed', 'hourly'];

const ServiceSchema = new mongoose.Schema({
  professional_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true, index: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategories', required: true, index: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  maximum_price: Number,
  minimum_price: Number,
  service_status: { type: Boolean, default: true },
  description: String,
  portfolio_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FilePath' }],
  completed_tasks: { type: Number, default: 0 },
  featured_projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeaturedProject' }],
  business_availability: { type: Boolean, default: true },
  pricing_type: { type: String, enum: PricingType, default: 'fixed' }
}, { timestamps: true, versionKey: false, collection: 'services' });

export default mongoose.model('Service', ServiceSchema);
