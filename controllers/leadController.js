import { acceptLeadService, createLeadService } from "../services/leadService.js";

// =================================
//      New Create Lead Controller
// ==================================
import {User} from "../models/user.js";

export const createLead = async (req, res) => {
  try {
    const {
      serviceId,
      responses,
      userInfo,
      userLocation,
      sendOption,
      selectedProfessionals = [],
      professionalId,
    } = req.body;

    // ✅ 1. Check if user exists; otherwise create new one
    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = await User.create({
        email: userInfo.email,
        phone: userInfo.phone,
        description: userInfo.description,
      });
    }

    // ✅ 2. Convert responses to answers array
    const answers = Object.entries(responses).map(([question_id, answer]) => ({
      question_id,
      answer,
    }));

    // ✅ 3. Handle file uploads (if using multer or similar)
    const files = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`, // or your upload URL (Cloudinary, Supabase)
      type: file.mimetype.startsWith("image") ? "image" : "file",
    }));

    // ✅ 4. Call service layer
    const { lead, assigned } = await createLeadService({
      service_id: serviceId,
      user_id: user._id,
      note: userInfo.description,
      answers,
      files,
      user_location: userLocation,
      send_option: sendOption,
      selectedProfessionals,
    });

    return res.status(201).json({
      success: true,
      message: "Lead generated successfully.",
      lead,
      assigned_to: assigned,
    });
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to generate lead.",
      error: error?.message || "Unexpected error occurred.",
    });
  }
};

// =================================================
//             New create Lead ends
// =================================================



// export const createLead = async (req, res) => {
//   try {
//     const { service_id, user_id, note, answers, files } = req.body;

//     // ✅ Validate required fields
//     if (!service_id || !user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Service ID, Customer ID, and Title are required.",
//       });
//     }

//     // ✅ Call service
//     const { lead, assigned } = await createLeadService({
//       service_id,
//       user_id,
//       note,
//       answers,
//       files,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Lead generated successfully.",
//       lead,
//       assigned_to: assigned,
//     });
//   } catch (error) {
//     console.error("Error creating lead:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to generate lead.",
//       error: error?.message || "An unexpected error occurred.",
//     });
//   }
// };

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