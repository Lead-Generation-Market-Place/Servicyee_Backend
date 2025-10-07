import Review from "../models/ReviewModel.js";

export function getAllReviews(user_id) {
  return Review.find({ user_id }).sort({ createdAt: -1 }).exec();
}

export async function createReviews(data) {
  const review = new Review(data); 
  return await review.save();
}
