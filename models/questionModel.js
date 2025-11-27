import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const QuestionSchema = new Schema({
  service_id: { type: Types.ObjectId, ref: 'Service', required: true, index: true },
  question_name: { type: String, required: true },
  form_type: { 
    type: String, 
    enum: ['checkbox', 'radio', 'text', 'select', 'number', 'date'], 
    required: true 
  },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false, collection: 'questions' });

QuestionSchema.virtual("answers", {
  ref: "Answer", 
  localField: "_id", 
  foreignField: "question_id" 
});

// Enable virtuals in JSON
QuestionSchema.set("toJSON", { virtuals: true });
QuestionSchema.set("toObject", { virtuals: true });

export default model('Question', QuestionSchema);
