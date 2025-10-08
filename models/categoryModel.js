import mongoose from "mongoose";

const categoryTypes = ['active', 'deactive'];

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: categoryTypes, default: 'active' },
  description: { type: String },
  category_image_url: { type: String },
});

export default mongoose.model('Category', categorySchema);
