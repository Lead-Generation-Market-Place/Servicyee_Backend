import { acceptLeadService, createLeadService, getProfessionalLeads } from "../../services/lead/leadService.js";
import {User} from "../../models/user.js";
import { leadValidationSchema } from "../../validators/leadValidator.js";
import mongoose from 'mongoose';
import servicesModel from "../../models/servicesModel.js";

// =================================
//      New Create Lead Controller
// ==================================


export const createLead = async (req, res) => {
  console.log("=== LEAD CREATION STARTED ===");
  
  try {
  //   console.log("📥 Raw Request Body: ", JSON.stringify(req.body, null, 2));
    
    const data = req.body;
    
    const {
      serviceId,
      responses,
      userInfo,
      userLocation,
      sendOption,
      professionalId,
      professionalIds,
    } = data;

    // console.log("🔍 Destructured Data:", {
    //   serviceId,
    //   responsesCount: Object.keys(responses || {}).length,
    //   userInfo: { 
    //     email: userInfo?.email, 
    //     phone: userInfo?.phone,
    //     hasDescription: !!userInfo?.description 
    //   },
    //   userLocation,
    //   sendOption,
    //   professionalId,
    //   professionalIds,
    //   selectedProfessionalsCount: professionalIds?.length || 0
    // });

    // ✅ 1. Check if user exists; otherwise create new one
    // console.log("👤 Checking user existence for:", userInfo.email);
    let user = await User.findOne({ email: userInfo.email });
    
    if (!user) {
      // console.log("➕ Creating new user");
      user = await User.create({
        email: userInfo.email,
        username: userInfo.email,
        password: "pass@123",
        phone: userInfo.phone,
        description: userInfo.description,
      });
      console.log("✅ User created");
    } else {
      console.log("✅ Existing user found:", user._id);
    }

    // ✅ 2. Convert responses to answers array
    const answers = Object.entries(responses).map(([question_id, answer]) => {
      // Handle fallback questions
      if (question_id === 'fallback') {
        return {
          question_id: null,
          answer,
          is_fallback: true
        };
      }
      
      return {
        question_id,
        answer,
      };
    });
    
    // console.log(`📝 Converted ${answers.length} responses to answers`);

    // ✅ 3. Handle file uploads
    const files = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith("image") ? "image" : "file",
      originalName: file.originalname,
    }));
    console.log(`📁 Processed ${files.length} files`);

    // ✅ 4. Generate title
    let leadTitle = 'New Service Request';
    
    try {
      const service = await servicesModel.findById(serviceId);
      if (service) {
        leadTitle = `Request for ${service.name}`;
      }
    } catch (error) {
      console.log("⚠️ Could not fetch service for title");
    }


    // ✅ 5. Call service layer - ALL professional assignment logic is now in service
    // console.log("🚀 Calling createLeadService with:", {
    //   service_id: serviceId,
    //   user_id: user._id,
    //   title: leadTitle,
    //   note: userInfo.description,
    //   answers_count: answers.length,
    //   files_count: files.length,
    //   send_option: sendOption,
    //   professionalId,
    //   selectedProfessionals: professionalIds
    // });

    const { lead, assigned } = await createLeadService({
      service_id: serviceId,
      user_id: user._id,
      title: leadTitle,
      note: userInfo.description,
      answers,
      files,
      user_location: userLocation,
      send_option: sendOption,
      selectedProfessionals: professionalIds, // This should contain top 5 + selected professional
      professionalId: professionalId,
    });

    // console.log("🎉 Lead creation completed:", {
    //   leadId: lead._id,
    //   assignedCount: assigned,
    //   sendOption: sendOption
    // });

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

export const getLeadByProfessionalId = async (req, res) => {
  try {
    const professionalId = req.params.professionalId;
    if (!professionalId) {
      return res.status(400).json({
        success:false,
        message:"Professional ID is required"
      });
    }
    console.log("Fetching leads for professional ID:", professionalId);
    const professionalLeads = await getProfessionalLeads(professionalId);
    if (!professionalLeads || professionalLeads.length === 0) {
      return res.status(404).json({
        success:false,
        message:"No leads found for this professional"
      });
    } 
    return res.status(200).json({
      success:true,
      message:"Leads fetched successfully",
      data: professionalLeads
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch leads",
      error:error?.message || "An unexpected error occured",
      data: []
    });

  }
}