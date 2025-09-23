import mongoose from 'mongoose';



const ServiceSchema = new mongoose.Schema({
 service_name: { type: String },
  subcategory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategories',},
   service_status: { type: Boolean, default: true },
 
}, { timestamps: true, versionKey: false, collection: 'services' });

export default mongoose.model('Service', ServiceSchema);
