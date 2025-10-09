import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
  description: { type: String },
  category_image_url: { type: String },
  
},{ 
  timestamps: true, 
  versionKey: false, 
  collection: 'services'
});

export default mongoose.model('Category', categorySchema);
