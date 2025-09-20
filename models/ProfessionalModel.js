import mongoose from 'mongoose';
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

const BusinessType = ['company', 'individual', 'sub-contractor'];
const MediaType = ['photo', 'video'];
const OpenClose = ['open', 'close'];

const ProfessionalSchema = new Schema({
  user_id: { type: ObjectId, ref: 'User', required: false },
  business_name: String,
  introduction: String,
  business_type: { type: String, enum: BusinessType },
  website: { type: String, required: false },
  founded_year: { type: Number, min: 1900, max: new Date().getFullYear(), required: false },
  employees: { type: Number, min: 1, required: false },
  total_hire: { type: Number, default: 0 },
  total_review: { type: Number, default: 0 },
  rating_avg: { type: Number, default: 0 },
  profile_image: { type: String, required: false },
  portfolio: [{
    service_id: { type: ObjectId, ref: 'Service' },
    media_type: { type: String, enum: MediaType },
    media_url: String
  }],
  business_hours: [{
    service_id: { type: ObjectId, ref: 'Service' },
    status: { type: String, enum: OpenClose },
    start_time: Date,
    end_time: Date,
    day: { type: Number, min: 0, max: 6 }
  }],
  specializations: [{
    service_id: { type: ObjectId, ref: 'Service', required: true },
    specialization_tag: { type: String, required: true }
  }]
}, { timestamps: true, versionKey: false, collection: 'professionals' });

ProfessionalSchema.index({ user_id: 1 });
ProfessionalSchema.index({ 'specializations.service_id': 1, 'specializations.specialization_tag': 1 });

const Professional = models.Professional || model('Professional', ProfessionalSchema);

export default Professional;
