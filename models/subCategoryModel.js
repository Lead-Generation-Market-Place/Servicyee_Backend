import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
    category_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',     
    required: true
  },
  description: { type: String },
  subcategory_image_url: { type: String },
},{ 
  timestamps: true, 
  versionKey: false, 
  collection: 'subcategories' 
});

export default mongoose.model('Subcategories', subCategorySchema);
