import mongoose from "mongoose";

const ReviewSchema = new Schema(
  { 
    user_id: { type: mongoose.Types.ObjectId, ref: "User", index: true },
    professional_id: { type: mongoose.Types.ObjectId, ref: "Professional", index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true },
    reply: { message: String, createdAt: { type: Date } },
    review_type: { type: String, enum: ["pending","approved","rejected"], index: true, default: "pending" },
    tags: [{ type: String }],
    helpful_by: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    photos: [{ media_url: String, type: { type: String, enum: ["image","video"], default: "image" } }],
  },
  { timestamps: true, versionKey: false, collection: "reviews" }
);

ReviewSchema.index({ professional_id: 1, createdAt: -1 });
ReviewSchema.index({ user_id: 1, professional_id: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
