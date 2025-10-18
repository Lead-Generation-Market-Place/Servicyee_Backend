import Professional from "../models/ProfessionalModel.js";
import { User } from "../models/user.js";
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
      updateData.profile_image = `${backendUrl}/${fullImageUrl}`;
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
  const profile = req.file
    ? `/uploads/professionals/${req.file.filename}`
    : null;
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
export async function getServicesQuestions(req, res) {
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
