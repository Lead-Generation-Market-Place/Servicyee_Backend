import { purchaseCreditsService } from "../services/CreditTransactionService.js";

export async function purchaseCreditsController(req, res) {
  try {
    const { professional_id, payment_data } = req.body;
    const user_id = req.user._id || req.user.id
    if (!professional_id || !payment_data || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID, package ID, data are required",
      });
    }
    const transaction = await purchaseCreditsService({
      professional_id,
      payment_data,
      user_id,
    });
    res.status(200).json({
      success: true,
      message: "Credits purchased successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error purchasing credits",
      error: error?.message || "An unexpected error occurred",
    });
  }
}
