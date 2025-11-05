import { acceptLeadService, createLeadService } from "../services/leadService.js";
import {User} from "../models/user.js";
import { leadValidationSchema } from "../validators/leadValidator.js";

// =================================
//      New Create Lead Controller
// ==================================


export const createLead = async (req, res) => {
  console.log("=== LEAD CREATION STARTED ===");
  
  try {
    console.log("📥 Raw Request Body: ", JSON.stringify(req.body, null, 2));
    
    // ✅ TEMPORARY: Use req.body directly instead of validated value
    const data = req.body;
    
    // Destructure from req.body directly
    const {
      serviceId, // Note: frontend sends serviceId, not service_id
      responses,
      userInfo,
      userLocation,
      sendOption,
      professionalId,
      selectedProfessionals,
    } = data;

    console.log("🔍 Destructured Data:", {
      serviceId,
      responsesCount: Object.keys(responses || {}).length,
      userInfo: { 
        email: userInfo?.email, 
        phone: userInfo?.phone,
        hasDescription: !!userInfo?.description 
      },
      userLocation,
      sendOption,
      professionalId,
      selectedProfessionalsCount: selectedProfessionals?.length || 0
    });

    // ✅ 1. Check if user exists; otherwise create new one
    console.log("👤 Checking user existence for:", userInfo.email);
    let user = await User.findOne({ email: userInfo.email });
    
    if (!user) {
      console.log("➕ Creating new user");
      user = await User.create({
        username: userInfo.email,
        email: userInfo.email,
        phone: userInfo.phone,
        password:userInfo.phone || "pass@123",
        description: userInfo.description,
      });
      console.log("✅ User created with ID:", user._id);
    } else {
      console.log("✅ Existing user found:", user._id);
    }

    // ✅ 2. Convert responses to answers array
    const answers = Object.entries(responses).map(([question_id, answer]) => ({
      question_id,
      answer,
    }));
    console.log(`📝 Converted ${answers.length} responses to answers`);

    // ✅ 3. Handle file uploads
    const files = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith("image") ? "image" : "file",
      originalName: file.originalname,
    }));
    console.log(`📁 Processed ${files.length} files`);

    // ✅ 4. Call service layer - use serviceId (from frontend)
    console.log("🚀 Calling createLeadService with:", {
      service_id: serviceId, // Use serviceId here
      user_id: user._id,
      answers_count: answers.length,
      files_count: files.length,
      professionalId,
      selectedProfessionals_count: selectedProfessionals?.length || 0
    });

    const { lead, assigned } = await createLeadService({
      service_id: serviceId, // Use serviceId
      user_id: user._id,
      title: "New Lead",
      answers,
      files,
      user_location: userLocation,
      send_option: sendOption,
      selectedProfessionals,
      professionalId,
    });

    console.log("🎉 Lead created successfully:", {
      leadId: lead._id,
      assignedCount: assigned?.length || 0
    });

    return res.status(201).json({
      success: true,
      message: "Lead generated successfully.",
      lead,
      assigned_to: assigned,
    });

  } catch (error) {
    console.error("❌ Error creating lead:", error);
    console.error("🔴 Error stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Unable to generate lead.",
      error: error?.message || "Unexpected error occurred.",
    });
  } finally {
    console.log("=== LEAD CREATION COMPLETED ===");
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