import { SendReviewEmail } from "../services/sendReviewEmail.js";

export async function SendReviewEmailCustomer(req, res) {
  const { recipientEmail, businessName, reviewLink } = req.body;
  if (!recipientEmail || !businessName || !reviewLink) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const emailResponse = await SendReviewEmail({
      recipientEmail,
      businessName,
      reviewLink,
    });
    return res.status(200).json({
      success: true,
      message: "Email successfully sent to customer",
      emailResponse,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Sending email error to customer",
      error: error?.message || "An unexpected error occurred",
    });
  }
}
