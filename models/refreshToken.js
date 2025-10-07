import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true, index: true },
  userAgent: String,
  ip: String,
  expiresAt: Date,
  revoked: { type: Boolean, default: false },
  replacedByTokenHash: String,
}, { timestamps: true });

export default mongoose.model("RefreshToken", refreshTokenSchema);
