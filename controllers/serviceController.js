// Core modules
import path from "path";
import fs from "fs";

import servicesService, {
  getProfessionalServices,
  CreateNewServiceProfessional,
  createServiceLocationServices,
  deleteProfessionalService,
  fetchServiceQuestionsByServiceId,
  submitServiceAnswers,
  updateServiceStatusServices,
  updateService,
  updateServiceStatus,
  updateFeaturedService,
} from "../services/services.js";

import { error } from "console";

export const getServices = async (req, res, next) => {
  try {
    const services = await servicesService.getAllServices();
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};
// Add a new service (like "Home Cleaning")
export const addServices = async (req, res, next) => {
  try {
    const serviceData = req.body;

    if (req.file) {
      serviceData.image_url = req.file.filename;
    } else {
      return res.status(400).json({ message: "Service image is required." });
    }
    const createdService = await servicesService.addService(serviceData);
    res.status(201).json({ data: createdService });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignServiceToProfessional = async (req, res, next) => {
  try {
    console.log("Received data:", req.body);
    const assignedService = await servicesService.assignServiceToProfessional(
      req.body
    );

    return res.status(201).json({
      assignedService,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to assign service.",
    });
  }
};

// Optional: get all assigned services of a professional
export const getAssignedServicesForProfessional = async (req, res, next) => {
  try {
    const professional_id = req.params.professionalId;
    const assignedServices =
      await servicesService.getAssignedServicesForProfessional(professional_id);
    res.status(200).json({ data: assignedServices });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await servicesService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ data: service });
  } catch (error) {
    next(error);
  }
};

export const updateServiceController = async (req, res, next) => {
  try {
    const updatedServiceDaata = req.body;
    const serviceId = req.params.id;
    const existingService = await servicesService.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (req.file) {
      if (existingService.image_url) {
        const oldImagePath = path.join(
          "uploads/service",
          existingService.image_url
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      updatedServiceDaata.image_url = req.file.filename;
    }
    const updatedService = await servicesService.updateService(
      serviceId,
      updatedServiceDaata
    );
    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const deletedService = await servicesService.deleteService(req.params.id);
    if (!deletedService)
      return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getServicesOFAuthenticatedUser = async (req, res, next) => {
  try {
    const services = await servicesService.getServicesOfProfessional(
      req.params.id
    );
    if (!services || services.length === 0)
      return res
        .status(404)
        .json({ message: "No services found for this user." });
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalCount = async (req, res, next) => {
  try {
    const serviceLocations =
      await servicesService.getAllPopularServiceLocationWithProCount();
    if (!serviceLocations) {
      return res.status(404).json({ message: "No service locations found." });
    }
    res.status(200).json({ message: serviceLocations });
  } catch (error) {
    next(error);
  }
};
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serviceId, status } = req.body;
    if (typeof status !== "boolean") {
      return res
        .status(400)
        .json({ message: "Status must be a boolean value." });
    }
    const updatedService = await servicesService.activeInactiveServiceToggle(
      serviceId,
      status
    );
    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};

// featured services
export const featuredServicesHandler = async (req, res) => {
  try {
    const featuredServices = await servicesService.getFeaturedServices();

    if (!featuredServices || featuredServices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured services found",
      });
    }

    res.status(200).json({
      success: true,
      data: featuredServices,
    });
  } catch (error) {
    console.error("Error fetching featured services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const fetchAllServicesOfAProfessional = async (req, res) => {
  try {
    const professionalId = req.params.id;

    const services =
      await servicesService.getServicesAndSubcategoriesByProfessional(
        professionalId
      );

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services of professional:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfessionalService = async (req, res, next) => {
  try {
    const { _id: proServiceId, serviceId, ...updateData } = req.body;

    if (!proServiceId || !serviceId) {
      return res.status(400).json({
        success: false,
        message:
          "proServiceId (_id) and serviceId are required in the request body",
      });
    }

    const updatedService =
      await servicesService.updateProfessionalServiceByProAndService(
        proServiceId,
        serviceId,
        updateData
      );

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating professional service:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update professional service",
    });
  }
};

export const deleteProService = async (req, res) => {
  try {
    const proServiceId = req.params.id;

    const result = await servicesService.deleteProfessionalService(
      proServiceId
    );

    res.status(200).json({
      success: true,
      message: "Professional service deleted successfully",
      data: result,
    });
  } catch (error) {
    // Differentiate between 400 and 500 errors if needed
    const statusCode =
      error.message.includes("not found") || error.message.includes("Valid")
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete professional service",
    });
  }
};

// Adding The Service Price - Professional Services...
export const addServicePricing = async (req, res) => {
  try {
    const { professional_id, service_id, ...pricingData } = req.body;
    if (!professional_id || !service_id) {
      return res.status(400).json({
        success: false,
        message: "Both professional_id and service_id are required.",
      });
    }
    const updatedPricing = await servicesService.addServicePricing(
      professional_id,
      service_id,
      pricingData
    );
    return res.status(200).json({
      success: true,
      message: "Service pricing updated successfully.",
      data: updatedPricing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "An unexpected error occurred while updating service pricing.",
    });
  }
};



export const getprofessionalServiceById = async (req, res) => {
 try {
    const { professional_id, service_id } = req.query;
    if (!professional_id || !service_id) {
      return res.status(400).json({
        success: false,
        message: "Both professional_id and service_id are required.",
      });
    }
    const services = await servicesService.getProfessionalServiceDetails(
      professional_id,
      service_id
    );
    if (!services) {
      return res.status(404).json({
        success: false,
        message: "No service found for this professional.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Service retrieved successfully.",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "An unexpected error occurred while retrieving service.",
    });
  }
};

export const updateServicePricing = async (req, res) => {
  try {
    const { professional_id, service_id, ...updateData } = req.body;

    if (!professional_id || !service_id) {
      return res
        .status(400)
        .json({ message: "professional_id and service_id are required" });
    }

    const updatedPricing = await servicesService.updateServicePricing(
      professional_id,
      service_id,
      updateData
    );

    res.status(200).json({
      message: "Service pricing updated successfully",
      data: updatedPricing,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get Professional Services of Active User

export async function GetProfessionalServices(req, res) {
  try {
    const userId = req.user?._id || req.user?.id || req.params.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const services = await getProfessionalServices(userId);
    if (!services) {
      return res.status(404).json({
        success: false,
        message: "Professional services not found for this user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Professional services retrieved successfully",
      services: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching professional services",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

// ===========================================================
//                    Manage Services
// ===========================================================

export const updateServiceHandler = async (req, res, next) => {
  try {
    const updatedServiceDaata = req.body;
    const serviceId = req.params.id;
    const existingService = await servicesService.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (req.file) {
      if (existingService.image_url) {
        const oldImagePath = path.join(
          "uploads/service",
          existingService.image_url
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      updatedServiceDaata.image_url = req.file.filename;
    }
    const updatedService = await updateService(serviceId, updatedServiceDaata);
    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "is_active must be a boolean value.",
      });
    }

    const updatedService = await updateServiceStatus(id, is_active);

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Service status updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to update service status",
    });
  }
};

export const updateFeaturedServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    if (typeof is_featured !== "boolean") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "is_featured must be a boolean value.",
      });
    }

    const updatedService = await updateFeaturedService(id, is_featured);

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Service featured status updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to update service featured status",
    });
  }
};

export const updateProfessionalServiceStatus = async (req, res) => {
  try {
    const { professional_id, service_id, service_status } = req.body;
    if (!professional_id || !service_id) {
      return res.status(400).json({
        success: false,
        message: "professional_id and service_id are required.",
      });
    }
    const service = await updateServiceStatusServices(
      professional_id,
      service_id,
      service_status
    );
    if (!service || !service.success) {
      return res.status(404).json({
        success: false,
        message: "No matching service found to update.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Service status updated successfully.",
      data: service.data || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating service status.",
      error: error.message,
    });
  }
};


// Create New Service - Professional
export async function CreateService(req, res) {
  const { service_name, professional_id, service_id } = req.body;
  try {
    if (!service_name || !professional_id || !service_id) {
      return res.status(400).json({
        success: false,
        message: "service_name, professional_id, and service_id are required.",
      });
    }
    const professional = await CreateNewServiceProfessional({
      service_name,
      professional_id,
      service_id,
    });
    return res.status(201).json({
      success: true,
      message: "New service created successfully.",
      professional,
    });
  } catch (error) {
    if (error.message === "Professional not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: "Error creating new service.",
      error: error?.message || "An unexpected error occurred.",
    });
  }
}

//  Get Service Questions by Service ID
export const getServiceQuestionsByServiceId = async (req, res) => {
  const service_id = req.params.id;
  try {
    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }
    const questions = await fetchServiceQuestionsByServiceId(service_id);
    return res.status(200).json({
      success: true,
      message: "Service questions retrieved successfully.",
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving service questions.",
      error: error?.message || "An unexpected error occurred.",
    });
  }
};

// Submit Answers to Service Questions for a Professional service
export const SubmitAnswersServiceQuestions = async (req, res) => {
  try {
    const answers = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers payload must be a non-empty array.",
      });
    }
    const { professional_id, service_id } = answers[0];
    if (!professional_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID is required in the answers payload.",
      });
    }

    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required in the answers payload.",
      });
    }
    for (const answer of answers) {
      const { question_id, answer: ans } = answer;
      if (!question_id) {
        return res.status(400).json({
          success: false,
          message: "Question ID is required in each answer.",
        });
      }
      if (
        ans === undefined ||
        ans === null ||
        (Array.isArray(ans) && ans.length === 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `Answer for question_id ${question_id} is missing.`,
        });
      }
    }
    const inserted = await submitServiceAnswers(
      answers,
      professional_id,
      service_id
    );
    return res.status(201).json({
      success: true,
      message: "Answers submitted successfully.",
      data: inserted,
    });
  } catch (error) {
    console.error("SubmitAnswersServiceQuestions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answers.",
      error: error?.message || "An unexpected error occurred.",
    });
  }
};

// Create Service Location for Professional Service
export async function createServiceLocationController(req, res) {
  const payload = req.body;
  try {
    const result = await createServiceLocationServices(payload);
    return res.status(200).json({
      success: true,
      message: "Service location added successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Service Location Error:", error);
    if (error.message === "Professional not found.") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update service location.",
      error: error?.message ?? "Unexpected server error.",
    });
  }
}

// Delete Service
export async function deleteSerivceById(req, res) {
  const { professional_id, service_id } = req.body;
  if (!service_id || !professional_id) {
    return res.status(400).json({
      success: false,
      message: "Both service ID and professional ID are required.",
    });
  }
  try {
    const result = await deleteProfessionalService({
      service_id,
      professional_id,
    });
    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
      error: error?.message ?? "Unexpected server error.",
    });
  }
}
