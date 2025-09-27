import Professional from "../models/ProfessionalModel.js";
import {
  createProfessional,
  getProfessionalByUserId,
  getAllProfessionals,
  updateProfessional,
  deleteProfessional,
  updateProfessionalService,
} from "../services/ProfessionalServices.js";

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
    year_founded,
    employees,
    website,
    payment_methods,
    address_line,
    zipcode,
  } = req.body;

  const profile_image = req.file ? req.file.path : undefined;

  try {
    const result = await updateProfessionalService(id, {
      business_name,
      year_founded,
      employees,
      website,
      payment_methods,
      address_line,
      zipcode,
      profile_image,
    });

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
