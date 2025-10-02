import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service',},
  zip_code: { type: Number },
});

export default mongoose.model('Search', searchSchema);
