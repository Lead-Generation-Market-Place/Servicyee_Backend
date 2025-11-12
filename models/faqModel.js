import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const FaqSchema = new Schema({
  question_id: { 
    type: Types.ObjectId, 
    ref: 'FaqQuestion', 
    required: true,
    index: true 
  },
  professional_id: { 
    type: Types.ObjectId, 
    ref: 'Professional', 
    required: true,
    index: true 
  },
  answer: { 
    type: String, 
    required: false,
    trim: true,
    maxlength: 5000
  }
}, { 
  timestamps: true, 
  versionKey: false, 
  collection: 'faqs' 
});

// Create indexes for better query performance
FaqSchema.index({ professional_id: 1 });
FaqSchema.index({ question_id: 1 });
FaqSchema.index({ professional_id: 1, question_id: 1 }, { unique: true }); // One answer per question per professional

export default model('Faq', FaqSchema);