import { createReviews } from "../services/Reviews.js";

export async function createReviewsHandler(req, res) {
  try {
    const review = await createReviews(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Review",
      error: error?.message || "An unexpected error occurred",
    });
  }
}
