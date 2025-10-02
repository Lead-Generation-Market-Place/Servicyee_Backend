import mongoose, { Schema, Types } from "mongoose";

const ProfessionalLeadSchema = new Schema(
  {
    lead_id: { type: Types.ObjectId, ref: "Lead", required: true, index: true },
    professional_id: { type: Types.ObjectId, ref: "Professional", required: true, index: true },
    
    status: {
      type: String,
      enum: ["sent", "viewed", "accepted", "rejected", "expired"],
      default: "sent",
    },
    
    read_by_pro: { type: Boolean, default: false },
    available: { type: Boolean, default: true }, // ⬅️ if false, professional can't act
    expire_at: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }, // ⬅️ expires in 7 days
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false, collection: "professional_leads" }
);

// prevent duplicates
ProfessionalLeadSchema.index({ lead_id: 1, professional_id: 1 }, { unique: true });
// optional TTL index if you want MongoDB to auto-remove expired documents
ProfessionalLeadSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ProfessionalLead", ProfessionalLeadSchema);



 