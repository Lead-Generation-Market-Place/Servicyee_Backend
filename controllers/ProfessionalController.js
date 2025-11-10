import Professional from "../models/ProfessionalModel.js";
import File from "../models/fileModel.js";
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
  createProfessionalAccountReview,
  getProfessionalProfileSummary,
  createFeaturedProject,
  createFeaturedProjectWithFiles,
  getFeaturedProjectById,
  getFeaturedProjects,
  getFeaturedProjectsByService,
  updateFeaturedProject,
  updateFeaturedProjectWithFiles,
  deleteFeaturedProject,
  deleteFilesByIds,
  addFilesToFeaturedProject,
  removeFilesFromFeaturedProject,
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
    const user_id = req.user.id; // Get authenticated user id from JWT middleware

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
    // You can save file info to DB or just return the file path
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
// End of Professional Account creation

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
      if (!grouped[key]) grouped[key] = { professional_id, service_id, answers: [] };
      grouped[key].answers.push({ question_id, answer });
    });

    const updatedAnswers = [];

    for (const key in grouped) {
      const { professional_id, service_id, answers } = grouped[key];
      const result = await createProfessionalServicesAnswers(professional_id, service_id, { answers });
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
export async function createProfessionalReview(req, res) {
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
    const reviewData = await createProfessionalAccountReview(professional._id);
    if (!reviewData?.success) {
      return res.status(400).json({
        success: false,
        message: reviewData.message || "Unable to fetch professional review",
        error: reviewData.error,
      });
    }
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

    // ✅ use correct field name: profile_image
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

// FeaturedProject Controller Methods

export async function createFeaturedProjectHandler(req, res) {
  try {
    const data = req.body;
    const files = req.files;
    const userId = req.user?.id;
    const professionalId = req.body.professionalId;

    let featuredProject;
    if (files && files.length > 0) {
      // If files are uploaded, use the enhanced method
      featuredProject = await createFeaturedProjectWithFiles(data, files, userId, professionalId);
    } else {
      // If no files, use the basic method
      featuredProject = await createFeaturedProject(data);
    }

    res.status(201).json({
      success: true,
      message: "Featured project created successfully",
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating featured project",
      error: error.message,
    });
  }
}

export async function getFeaturedProjectByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const featuredProject = await getFeaturedProjectById(id);
    if (!featuredProject) {
      return res.status(404).json({
        success: false,
        message: "Featured project not found",
      });
    }
    res.status(200).json({
      success: true,
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured project",
      error: error.message,
    });
  }
}

export async function getFeaturedProjectsHandler(req, res) {
  try {
    const filters = req.query;
    const featuredProjects = await getFeaturedProjects(filters);
    res.status(200).json({
      success: true,
      featuredProjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured projects",
      error: error.message,
    });
  }
}

export async function getFeaturedProjectsByServiceHandler(req, res) {
  try {
    const { serviceId } = req.params;
    const featuredProjects = await getFeaturedProjectsByService(serviceId);
    res.status(200).json({
      success: true,
      featuredProjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured projects by service",
      error: error.message,
    });
  }
}

export async function updateFeaturedProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const files = req.files;
    const userId = req.user?.id;
    const professionalId = req.body.professionalId;

    let featuredProject;
    if (files && files.length > 0) {
      // If files are uploaded, use the enhanced method
      featuredProject = await updateFeaturedProjectWithFiles(id, data, files, userId, professionalId);
    } else {
      // If no files, use the basic method
      featuredProject = await updateFeaturedProject(id, data);
    }

    if (!featuredProject) {
      return res.status(404).json({
        success: false,
        message: "Featured project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Featured project updated successfully",
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating featured project",
      error: error.message,
    });
  }
}

export async function deleteFeaturedProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const featuredProject = await deleteFeaturedProject(id);
    if (!featuredProject) {
      return res.status(404).json({
        success: false,
        message: "Featured project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Featured project deleted successfully",
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting featured project",
      error: error.message,
    });
  }
}

export async function addFilesToFeaturedProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const { fileIds } = req.body;
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "fileIds must be a non-empty array",
      });
    }
    const featuredProject = await addFilesToFeaturedProject(id, fileIds);
    if (!featuredProject) {
      return res.status(404).json({
        success: false,
        message: "Featured project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Files added to featured project successfully",
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding files to featured project",
      error: error.message,
    });
  }
}

export async function removeFilesFromFeaturedProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const { fileIds } = req.body;
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "fileIds must be a non-empty array",
      });
    }
    const featuredProject = await removeFilesFromFeaturedProject(id, fileIds);
    if (!featuredProject) {
      return res.status(404).json({
        success: false,
        message: "Featured project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Files removed from featured project successfully",
      featuredProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing files from featured project",
      error: error.message,
    });
  }
}

export async function addProfessionalFiles(req, res) {
  try {
    const { userId, professionalId, relatedModel, relatedModelId, fileType } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const fileDocs = req.files.map((file) => ({
      userId,
      professionalId,
      relatedModel,
      relatedModelId,
      fileName: file.originalname,
      filePath: file.path,
      fileType,
      fileSize: file.size,
      metaData: { mimetype: file.mimetype },
    }));

    const savedFiles = await File.insertMany(fileDocs);

    res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      files: savedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    });
  }
}