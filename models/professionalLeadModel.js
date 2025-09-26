import mongoose, { Schema, Types } from "mongoose";

const ProfessionalLeadSchema = new Schema({
  lead_id: { type: Types.ObjectId, ref: "Lead", required: true, index: true },
  professional_id: { type: Types.ObjectId, ref: "Professional", required: true, index: true },

  status: { 
    type: String, 
    enum: ["sent", "viewed", "accepted", "rejected", "completed"], 
    default: "sent" 
  },

  read_by_pro: { type: Boolean, default: false },

  // ✅ New: expiration time for this assignment
  expire_at: { type: Date }, // optional field; you can set TTL if desired

  // ✅ New: availability status (whether professional is available to respond)
  availability: { 
    type: String, 
    enum: ["available", "not_available"], 
    default: "available" 
  },

  created_at: { type: Date, default: Date.now }
}, { 
  timestamps: true, 
  versionKey: false, 
  collection: "professional_leads" 
});

// Prevent duplicate assignments
ProfessionalLeadSchema.index({ lead_id: 1, professional_id: 1 }, { unique: true });

// 🕒 Optional: Auto-delete expired documents (TTL index)
// Uncomment this line if you want MongoDB to automatically remove expired records
// ProfessionalLeadSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ProfessionalLead", ProfessionalLeadSchema);
