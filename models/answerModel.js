import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AnswerSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
  lead_id: { type: Schema.Types.ObjectId, ref: 'Lead' },
  professional_id: { type: Schema.Types.ObjectId, ref: 'Professional' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: { type: Schema.Types.Mixed }
}, { timestamps: true, versionKey: false, collection: 'answers' });

export default model('Answer', AnswerSchema);
