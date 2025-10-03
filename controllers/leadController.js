import { acceptLeadService, createLeadService } from "../services/leadService.js";

export const createLead = async (req, res) => {
  try {
    const { service_id, user_id, note, answers, files } = req.body;

    // ✅ Validate required fields
    if (!service_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Service ID, Customer ID, and Title are required.",
      });
    }

    // ✅ Call service
    const { lead, assigned } = await createLeadService({
      service_id,
      user_id,
      note,
      answers,
      files,
    });

    return res.status(201).json({
      success: true,
      message: "Lead generated successfully.",
      lead,
      assigned_to: assigned,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to generate lead.",
      error: error?.message || "An unexpected error occurred.",
    });
  }
};

export const acceptLead = async (req, res) => {
  try {
    const {leadId, professionalId } = req.body;
    if (!leadId || !professionalId) {
      return res.status(400).json({
        success:false,
        message:"Lead and professional are required"
      });
    }

    const accepted = await acceptLeadService({leadId, professionalId});
    return res.status(200).json({
      success: true,
      message: "Lead accepted successfully",
      data: accepted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to accept lead",
      error:error?.message || "An unexpected error occured"
    });
  }
}