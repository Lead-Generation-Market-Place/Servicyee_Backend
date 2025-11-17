import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const FaqQuestionSchema = new Schema({
  question: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000 
  }
}, { 
  timestamps: true, 
  versionKey: false, 
  collection: 'faqquestions' 
});

export default model('FaqQuestion', FaqQuestionSchema);