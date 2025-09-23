import mongoose from "mongoose";

const subCategoryTypes = ['active', 'deactive'];

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: subCategoryTypes, default: 'active' },
    category_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',     
    required: true
  }
});

export default mongoose.model('SubCategories', subCategorySchema);
