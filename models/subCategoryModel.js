import mongoose from "mongoose";

const subCategoryTypes = ['active', 'deactive'];

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: subCategoryTypes, default: 'active' },
    category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',      // Reference to Category model
    required: true
  }
});

export default mongoose.model('SubCategories', categorySchema);
