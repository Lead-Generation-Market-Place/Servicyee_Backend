import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Service name is required'],
    trim: true
  },
  slug: { 
    type: String, 
    required: [true, 'Slug is required'],
    trim: true
  },
  subcategory_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategories',
    required: [true, 'Subcategory is required']
  },
  description: { 
    type: String,
    required: [true, 'Description is required']
  },
  image_url: { 
    type: String,
    required: [true, 'Image URL is required']
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  
  is_featured:{type:Boolean, default:false}
  
}, { 
  timestamps: true, 
  versionKey: false, 
  collection: 'services' 
});

export default mongoose.model('Service', ServiceSchema);