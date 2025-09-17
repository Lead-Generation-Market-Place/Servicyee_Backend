import mongoose from "mongoose";

const categoryTypes = ['active', 'deactive'];

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: categoryTypes, default: 'active' },
});

export default mongoose.model('Category', categorySchema);
