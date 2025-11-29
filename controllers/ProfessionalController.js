import Professional from "../models/ProfessionalModel.js";
import File from "../models/proMediaModel.js";
import {
  createProfessional,
  getProfessionalByUserId,
  getAllProfessionals,
  updateProfessional,
  deleteProfessional,
  updateProfessionalService,
  CreateProAccountStepOne,
  CreateProAccountStepThree,
  CreateProAccountStepFour,
  createProAccountStepSeven,
  getProServicesQuestions,
  createProfessionalServicesAnswers,
  createProAccountStepNine,
  // createProfessionalAccountReview,
  getProfessionalProfileSummary,

 
  // Simple FAQ Service Imports

  FaqService,

 
  getFaqsByProfessional,
  getAllLicenseTypes,
  getAllCities,
  saveProfessionalLicense,
  getAllProfessionalLicenses,
  getProfessionalLicenseById,
  updateProfessionalLicense,
  deleteProfessionalLicense,

  uploadProMediaService,
  getProMediaService,
  createFeaturedProjectService,
  getProFeaturedProjectService,

  createProfessionalReview,
  updateProfessionalAvailabilityService,
  getProfessionalLeadsByUserId,
  updateProfessionalProfileView,

} from "../services/ProfessionalServices.js";
const backendUrl =
  process.env.BACKEND_PRODUCTION_URL || "https://frontend-servicyee.vercel.app";

export async function createProfessionalHandler(req, res) {
  try {
    const professional = await createProfessional(req.body);
    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating professional",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function getProfessionalByUserIdHandler(req, res) {
  try {
    const user_id = req.user.id;

    const professional = await getProfessionalByUserId(user_id);
    if (!professional)
      return res.status(404).json({ message: "Professional not found" });
    res.json(professional);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching professional",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Get Professional leads ///
export async function getProfessionaLeadsById(req, res) {
  try {
    const user_id = req.user.id;
    const professional = await getProfessionalLeadsByUserId(user_id);
    if (!professional)
      return res.status(404).json({ message: "Professional not found" });
    res.json(professional);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching professional",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function getAllProfessionalsHandler(req, res) {
  try {
    const professionals = await getAllProfessionals();
    res.json(professionals);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching professionals",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function updateProfessionalHandler(req, res) {
  try {
    const professional = await updateProfessional(req.params.id, req.body);
    res.json(professional);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating professional",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function deleteProfessionalHandler(req, res) {
  try {
    await deleteProfessional(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting professional",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Handle file upload
export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function updateProfessionalIntroductionById(req, res) {
  const { id } = req.params;
  const { introduction } = req.body;
  try {
    const professional = await updateProfessional(id, { introduction });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional introduction updated successfully",
      professional,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating introduction",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function updateProfessionalInfo(req, res) {
  const { id } = req.params;
  const {
    business_name,
    founded_year,
    employees,
    website,
    payment_methods,
    address_line,
    zipcode,
  } = req.body;

  try {
    const updateData = {
      business_name,
      founded_year,
      employees,
      website,
      payment_methods,
      address_line,
      zipcode,
    };

    if (req.file) {
      const fullImageUrl = req.file.path;
      updateData.profile_image = `${fullImageUrl}`;
    }

    const result = await updateProfessionalService(id, updateData);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional info updated successfully",
      professional: result.professional,
      location: result.location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating professional info",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Account Step 01
export async function createProfessionalAccount(req, res) {
  const data = req.body;
  try {
    const professional = await CreateProAccountStepOne(data);
    if (!professional) {
      return res.status(400).json({
        success: false,
        message: "Email Address already exists",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Professional account created successfully",
      professional,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating professional account",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Account Step 03
export async function createProfessionalStepThree(req, res) {
  const { id } = req.params;
  const { business_name } = req.body;
  try {
    const professional = await CreateProAccountStepThree(id, { business_name });

    return res.status(200).json({
      success: true,
      message: "Professional Business Name updated successfully",
      professional,
    });
  } catch (error) {
    if (error.message === "Professional not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res.status(400).json({
      success: false,
      message: "Error updating professional info",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professioanl Account Step 04
export async function createProfessionalStepFour(req, res) {
  const { id } = req.params;
  const { businessType, employees, founded, about } = req.body;
  const profile = req.file ? req.file.filename : null;
  try {
    const professional = await CreateProAccountStepFour(id, {
      businessType,
      employees: employees ? Number(employees) : null,
      founded: founded ? Number(founded) : null,
      about,
      profile,
    });
    return res.status(200).json({
      success: true,
      message: "Professional Business Info updated successfully",
      professional,
    });
  } catch (error) {
    if (error.message === "Professional not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res.status(400).json({
      success: false,
      message: "Error updating professional info",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Account Step 07
export async function createProfessionalStepSeven(req, res) {
  const id = req.params.id;
  const { schedule, timezone } = req.body;
  try {
    const professional = await createProAccountStepSeven(id, {
      schedule,
      timezone,
    });
    return res.status(200).json({
      success: true,
      message: "Professional Business Availability updated successfully",
      professional,
    });
  } catch (error) {
    if (error.message === "Professional not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(400).json({
      success: false,
      message: "Error updating professional info",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Get Question of Services - Pro Register Step 08
export async function getServicesQuestionsPro(req, res) {
  const professional = await Professional.findOne({
    user_id: req.user.id,
  }).select("_id");
  if (!professional) {
    return res.status(404).json({
      success: false,
      message: "Professional profile not found for this user",
    });
  }
  const id = professional._id;
  try {
    const services = await getProServicesQuestions(id);

    if (!services) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Questions of services fetched successfully",
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Account Step 08
export async function createProfessionalStepEight(req, res) {
  try {
    const answers = Array.isArray(req.body) ? req.body : req.body.answers;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers payload must be a non-empty array",
      });
    }
    const grouped = {};
    answers.forEach(({ professional_id, service_id, question_id, answer }) => {
      if (!professional_id || !service_id || !question_id) return;
      const key = `${professional_id}-${service_id}`;
      if (!grouped[key])
        grouped[key] = { professional_id, service_id, answers: [] };
      grouped[key].answers.push({ question_id, answer });
    });

    const updatedAnswers = [];

    for (const key in grouped) {
      const { professional_id, service_id, answers } = grouped[key];
      const result = await createProfessionalServicesAnswers(
        professional_id,
        service_id,
        { answers }
      );
      updatedAnswers.push(...result);
    }

    return res.status(200).json({
      success: true,
      message: "Professional Services Answers added/updated successfully",
      answers: updatedAnswers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating professional answers",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Step 09
export async function createProfessionalStepNine(req, res) {
  const data = req.body;
  try {
    const professional = await createProAccountStepNine(data);
    return res.status(200).json({
      success: true,
      message: "Professional Service Location added successfully",
      professional,
    });
  } catch (error) {
    if (error.message === "Professional not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating professional info",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Create Professional Account - Review Account
export async function createProfessionalGetSteps(req, res) {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const professional = await Professional.findOne({ user_id: userId }).lean();
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional account not found for this user",
      });
    }
    const professional_id = professional._id || professional.id;
    console.log("Professional ID:", professional_id);
    const reviewData = await createProfessionalReview(professional_id);
    return res.status(200).json({
      success: true,
      message: "Professional account - Get details successfully",
      professional: reviewData,
    });
  } catch (error) {
    console.error("Error creating professional review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating professional account review",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

//Noor Ahmad Bashery

export async function getProfessionalProfile(req, res) {
  try {
    const userId = req.user?.id || req.params.id;
    const professional = await getProfessionalProfileSummary(userId);

    const profileWithUrl = professional.profile_image
      ? professional.profile_image.startsWith("http")
        ? professional.profile_image
        : `${backendUrl}${professional.profile_image}`
      : null;

    res.status(200).json({
      businessName: professional.business_name,
      profile: profileWithUrl,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// ========================================================
//             Professional featured project
// ========================================================
export const createFeaturedProjectHandler = async (req, res) => {
  try {
    const {
      professional_id,
      service_id,
      cityname,
      projectTitle,
      approximate_total_price,
      duration_type,
      duration_value,
      year,
      description,
    } = req.body;

    console.log("Feature project data: ", req.body);
    const files = req.files;

    console.log("The files: ", req.files);

    const projectData = {
      professional_id,
      service_id,
      cityname,
      projectTitle,
      approximate_total_price,
      duration: {
        type: duration_type,
        value: duration_value,
      },
      year,
      description,
    };

    // Call the service (without res parameter)
    const project = await createFeaturedProjectService(projectData, files);

    // ✅ Controller handles the HTTP response
    res.status(201).json({ 
      success: true, 
      message: "Featured project created successfully",
      project 
    });

  } catch (error) {
    console.error("Controller error:", error);
    
    // ✅ Controller handles the error response
    res.status(500).json({ 
      status: 500, 
      error: error.message || "Internal server error" 
    });
  }
};;

export async function getProFeaturedProjectHandler(req, res) {
  try {
    const professional_id = req.params.id;
    
    if (!professional_id) {
      return res.status(400).json({
        success: false,
        message: "Professional not found",
        data: []
      });
    }

    const response = await getProFeaturedProjectService(professional_id);
    console.log("Data: ", response);
    return res.status(200).json({
      success: true,
      message: "Professional featured projects retrieved successfully",
      data: response,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to get professional featured projects",
      error: error?.message || "An unexpected error occurred",
      data: []
    });
  }
}





// Simple FAQ Controller Methods

export async function createFaqQuestionHandler(req, res) {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const faqQuestion = await createFaqQuestion(question.trim());

    res.status(201).json({
      success: true,
      message: "FAQ question created successfully",
      faq: faqQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating FAQ question",
      error: error.message,
    });
  }
}

export async function getProFaqsHandler(req, res) {
  try {

    const { professionalId } = req.query;
    console.log("Received Professional ID:", professionalId);

    const questions = await FaqService.getProfessionalFaq(professionalId);


    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
}

export async function getFaqsByProfessionalHandler(req, res) {
  try {
    const { professionalId } = req.params;

    const faqs = await getFaqsByProfessional(professionalId);

    res.status(200).json({
      success: true,
      faqs,
      total: faqs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQs",
      error: error.message,
    });
  }
}

export async function updateFaqAnswerHandler(req, res) {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const updatedFaq = await updateFaqAnswer(id, answer.trim());

    if (!updatedFaq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ answer updated successfully",
      faq: updatedFaq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating FAQ answer",
      error: error.message,
    });
  }
}

// Get all license types for dropdown
export async function getLicenseTypesHandler(req, res) {
  try {
    const licenseTypes = await getAllLicenseTypes();
    res.status(200).json({
      success: true,
      data: licenseTypes,
      count: licenseTypes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching license types",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Get all cities for dropdown
export async function getCitiesHandler(req, res) {
  try {
    const cities = await getAllCities();
    res.status(200).json({
      success: true,
      data: cities,
      count: cities.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cities",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Save professional license
export async function saveProfessionalLicenseHandler(req, res) {
  try {
    const licenseData = req.body;

    if (!licenseData) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const savedLicense = await saveProfessionalLicense(licenseData);
    res.status(201).json({
      success: true,
      message: "Professional license saved successfully",
      data: savedLicense,
    });
  } catch (error) {
    console.error("Error in saveProfessionalLicenseHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error saving professional license",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Get all professional licenses
export async function getAllProfessionalLicensesHandler(req, res) {
  try {
    const { professional_id } = req.params;

    if (!professional_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID is required",
      });
    }

    const licenses = await getAllProfessionalLicenses(professional_id);
    res.status(200).json({
      success: true,
      data: licenses,
      count: licenses.length,
    });
  } catch (error) {
    console.error("Error in getAllProfessionalLicensesHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching professional licenses",
      error: error?.message || "An unexpected error occurred",
    });
  }
}
// Get specific professional license by ID
export async function getProfessionalLicenseByIdHandler(req, res) {
  try {
    const { professional_id, license_id } = req.params;

    if (!professional_id || !license_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID and License ID are required",
      });
    }

    const license = await getProfessionalLicenseById(
      professional_id,
      license_id
    );
    res.status(200).json({
      success: true,
      data: license,
    });
  } catch (error) {
    console.error("Error in getProfessionalLicenseByIdHandler:", error);
    res.status(500).json({
      error,
    });
  }
}
// Update specific professional license
export async function updateProfessionalLicenseHandler(req, res) {
  try {
    const { professional_id, license_id } = req.params;
    const updateData = req.body;

    if (!professional_id || !license_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID and License ID are required",
      });
    }

    const updatedLicense = await updateProfessionalLicense(
      professional_id,
      license_id,
      updateData
    );
    res.status(200).json({
      success: true,
      message: "Professional license updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    console.error("Error in updateProfessionalLicenseHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error updating professional license",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// Delete specific professional license
export async function deleteProfessionalLicenseHandler(req, res) {
  try {
    const { professional_id, license_id } = req.params;

    if (!professional_id || !license_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID and License ID are required",
      });
    }

    const deletedLicense = await deleteProfessionalLicense(
      professional_id,
      license_id
    );
    res.status(200).json({
      success: true,
      message: "Professional license deleted successfully",
      data: deletedLicense,
    });
  } catch (error) {
    console.error("Error in deleteProfessionalLicenseHandler:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting professional license",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function deleteFaqHandler(req, res) {
  try {
    const { id } = req.params;
    const deletedFaq = await deletedFaq(id);

    if (!deletedFaq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting FAQ",
      error: error.message,
    });
  }
}


// ===================================================
//           Pro Media Controller section
// ===================================================

export const uploadProMediaHandler = async (req, res, next) => {
  try {
    const proId = req.params.proId;
    const projectId = req.body.projectId || null;
    const source = req.body.source || "gallery";

    const mediaArray = [];

    // Add images
    if (req.files && req.files.length > 0) {
      const allowedImageExts = ["jpg","jpeg","png","gif","webp"];
      for (const file of req.files) {
        const ext = file.originalname.split(".").pop().toLowerCase();
        if (!allowedImageExts.includes(ext)) continue;

        mediaArray.push({
          professionalId: proId,
          userId: req.body.userId,
          fileName: file.originalname,
          fileUrl: `/uploads/promedia/${file.filename}`,
          fileSize: file.size,
          source,
          projectId
        });
      }
    }

    // Add YouTube links
    let youtubeLinks = req.body.youtubeEmbed || [];
    if (!Array.isArray(youtubeLinks)) youtubeLinks = [youtubeLinks];
    for (const link of youtubeLinks) {
      if (!link) continue;
      mediaArray.push({
        professionalId: proId,
        userId: req.body.userId,
        youtubeEmbed: link.trim(),
        source,
        projectId
      });
    }

    if (mediaArray.length === 0) {
      return res.status(400).json({ message: "No images or YouTube links provided." });
    }

    // Call the service **once** with all media
    const savedMedia = await uploadProMediaService(mediaArray);

    res.status(201).json({ success: true, media: savedMedia });
  } catch (error) {
    next(error);
  }
};

export const getProMediaHandler = async (req, res, next) => {
  try {
    const proId = req.params.proId;

    if (!proId) {
      return res.status(400).json({
        success: false,
        message: "Professional ID is required",
      });
    }

    const data = await getProMediaService(proId);

    res.status(200).json({
      success: true,
      message: "Professional media retrieved successfully",
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the professional media",
      error: error?.message || "An unexpected error occurred",
      data: [],
    });
  }
};

// Update Business Availability
/**
 * Update business availability
 * PUT /api/v1/professionals/update_availability
 */
export const updateBusinessAvailability = async (req, res) => {
  try {
    const { professional_id, isAvailable, hiddenUntil } = req.body;

    // Validate required fields
    if (!professional_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID is required",
      });
    }

    if (isAvailable === false && !hiddenUntil) {
      return res.status(400).json({
        success: false,
        message: "Hidden until date is required when deactivating business",
      });
    }
    // Update professional availability
    const updatedProfessional = await updateProfessionalAvailabilityService(
      professional_id,
      { isAvailable, hiddenUntil }
    );
    return res.json({
      success: true,
      message: isAvailable
        ? "Business activated successfully"
        : "Business temporarily deactivated",
      data: updatedProfessional,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



export const professionalProfileView = async (req, res) => {
  try {
    const { professional_id } = req.body;
    if (!professional_id) {
      return res.status(400).json({
        success: false,
        message: "professional_id is required",
      });
    }
    const updatedProfessional = await updateProfessionalProfileView(
      professional_id
    );
    return res.status(200).json({
      success: true,
      data: updatedProfessional,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};


