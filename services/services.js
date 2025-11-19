// servicesService.js
import ServiceModel from "../models/servicesModel.js";
import ProfessionalServicesModel from "../models/professionalServicesModel.js";
import answerModel from "../models/answerModel.js";
import mongoose from "mongoose";
import answer from "./answer.js";
import LocationModel from "../models/LocationModel.js";
import { response } from "express";
import Professional from "../models/ProfessionalModel.js";
import leadModel from "../models/leadModel.js";
import professionalServicesModel from "../models/professionalServicesModel.js";
import questionModel from "../models/questionModel.js";
import zipcodeModel from "../models/zipcodeModel.js";

class ServicesService {
  // ✅ Get all services
  async getAllServices() {
    return await ServiceModel.find({});
  }

  // ✅ Add a new service
  async addService(serviceData) {
    const { name, slug, subcategory_id } = serviceData;

    if (!name || !slug || !subcategory_id) {
      throw new Error("Name, slug, and subcategory_id are required fields.");
    }

    const existingService = await ServiceModel.findOne({
      slug: slug.trim(),
      subcategory_id,
    });

    if (existingService) {
      throw new Error("Service already exists under this subcategory");
    }

    const newService = new ServiceModel(serviceData);
    return await newService.save();
  }

  // ✅ Assign service to a professional (only with professional_id and service_id)
  async assignServiceToProfessional(data) {
    const { professional_id, service_id } = data;

    if (!professional_id || !service_id) {
      throw new Error("Both professional_id and service_id are required.");
    }

    const existing = await ProfessionalServicesModel.findOne({
      professional_id,
      service_id,
    });

    if (existing) {
      throw new Error("You already saved this service.");
    }

    const newAssignment = new ProfessionalServicesModel({
      professional_id,
      service_id,
    });

    const savedAssignment = await newAssignment.save();

    // ✅ Return just the ID (or entire object if needed)
    return { _id: savedAssignment._id };
  }

  // ✅ Get assigned services for a professional
  async getAssignedServicesForProfessional(professional_id) {
    return await ProfessionalServicesModel.find({ professional_id })
      .populate("service_id")
      .populate("location_id");
  }

  // ✅ Get service by ID
  async getServiceById(serviceId) {
    return await ServiceModel.findById(serviceId);
  }

  // ✅ Update service
  async updateService(serviceId, updateData) {
    return await ServiceModel.findByIdAndUpdate(serviceId, updateData, {
      new: true,
    });
  }

  // ✅ Delete service
  async deleteService(serviceId) {
    return await ServiceModel.findByIdAndDelete(serviceId);
  }

  // ✅ Get featured services
  async getFeaturedServices() {
    return await ServiceModel.find({ is_featured: true });
  }

  // ✅ Popular service locations with professional count
  async getAllPopularServiceLocationWithProCount() {
    try {
      const result = await ProfessionalServicesModel.aggregate([
        {
          $match: {
            service_status: true,
            service_availability: true,
          },
        },
        {
          $group: {
            _id: "$location_id",
            professionalCount: { $addToSet: "$professional_id" },
          },
        },
        {
          $project: {
            location_id: "$_id",
            professionalCount: { $size: "$professionalCount" },
          },
        },
        {
          $lookup: {
            from: "locations",
            localField: "location_id",
            foreignField: "_id",
            as: "location",
          },
        },
        { $unwind: "$location" },
        {
          $group: {
            _id: "$location.state",
            totalProfessionals: { $sum: "$professionalCount" },
          },
        },
        {
          $project: {
            state: "$_id",
            totalProfessionals: 1,
            _id: 0,
          },
        },
        { $sort: { totalProfessionals: -1 } },
      ]);

      return result.length === 0
        ? "No popular service locations found."
        : result;
    } catch (error) {
      console.error(
        "Error in getAllPopularServiceLocationWithProCount:",
        error
      );
      throw error;
    }
  }

  // ✅ Toggle active/inactive service
  async activeInactiveServiceToggle(serviceId, status) {
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }
    service.service_status = status;
    return await service.save();
  }

  async getServicesAndSubcategoriesByProfessional(professionalId) {
    if (!professionalId || !mongoose.Types.ObjectId.isValid(professionalId)) {
      throw new Error("A valid Professional ID is required");
    }

    try {
      const services = await ProfessionalServicesModel.find({
        professional_id: professionalId,
        service_status: true,
      })
        .populate({
          path: "service_id",
          select:
            "name slug description image_url is_active is_featured subcategory_id createdAt updatedAt",
          populate: {
            path: "subcategory_id",
            model: "Subcategories",
            select: "name slug category_id",
          },
        })
        .populate({
          path: "location_ids",
          model: "Location",
          select: "-__v -createdAt -updatedAt",
          populate: [
            {
              path: "mile_id",
              model: "Mile",
              select: "_id mile",
            },
            {
              path: "minute_id",
              model: "Minute",
              select: "_id minute",
            },
            {
              path: "vehicle_type_id",
              model: "VehicleType",
              select: "_id vehicle_type",
            },
          ],
        })
        .lean();

      if (!services.length) return [];

      const enrichedServices = await Promise.all(
        services.map(async (ps) => {
          const service = ps.service_id || {};
          const subcategory = service.subcategory_id || {};

          // Fetch questions related to the service
          const questions = await questionModel
            .find({
              service_id: service._id,
              active: true,
            })
            .select("_id question_name form_type options required order")
            .sort({ order: 1 })
            .lean();

          // Fetch answers by professional for the related questions
          const questionIds = questions.map((q) => q._id);
          const answers = await answerModel
            .find({
              professional_id: professionalId,
              question_id: { $in: questionIds },
            })
            .select("question_id answers")
            .lean();

          // Map answers by question_id
          const answerMap = {};
          answers.forEach((ans) => {
            answerMap[ans.question_id.toString()] = ans.answers;
          });

          // Attach answers to questions and create question-answer entities
          const questionAnswerEntities = questions.map((q) => ({
            _id: q._id,
            question_name: q.question_name,
            form_type: q.form_type,
            options: q.options || [],
            required: q.required || false,
            order: q.order || 0,
            answer: answerMap[q._id.toString()] || null,
          }));

          // Transform location data properly
          const transformedLocations = (ps.location_ids || []).map(
            (location) => {
              // Handle coordinates
              let coordinates = { type: "Point", coordinates: [0, 0] };
              if (location.coordinates && location.coordinates.coordinates) {
                coordinates = {
                  type: location.coordinates.type || "Point",
                  coordinates: location.coordinates.coordinates,
                };
              }

              return {
                _id: location._id?.toString(),
                type: location.type || "service",
                professional_id: location.professional_id?.toString(),
                service_id: location.service_id?.toString(),
                country: location.country || "",
                state: location.state || "",
                city: location.city || "",
                zipcode: location.zipcode || "",
                address_line: location.address_line || "",
                // Handle populated objects properly
                mile_id: location.mile_id?._id?.toString() || "",
                mile: location.mile_id?.mile || location.mile || 0,
                minute_id: location.minute_id?._id?.toString() || "",
                minute: location.minute_id?.minute || location.minute || 0,
                vehicle_type_id:
                  location.vehicle_type_id?._id?.toString() || "",
                vehicle_type:
                  location.vehicle_type_id?.vehicle_type ||
                  location.vehicle_type ||
                  "",
                coordinates: coordinates,
              };
            }
          );

          return {
            professionalServiceId: ps._id.toString(),
            service: {
              _id: service._id?.toString() || null,
              name: service.name || "",
              slug: service.slug || "",
              description: service.description || "",
              image_url: service.image_url || "",
              is_active: service.is_active ?? true,
              is_featured: service.is_featured ?? false,
              createdAt: service.createdAt,
              updatedAt: service.updatedAt,
            },
            subcategory: {
              _id: subcategory._id?.toString() || null,
              name: subcategory.name || "",
              slug: subcategory.slug || "",
              category_id: subcategory.category_id?.toString() || null,
            },
            professionalServiceDetails: {
              locations: transformedLocations,
              maximum_price: ps.maximum_price ?? null,
              minimum_price: ps.minimum_price ?? null,
              pricing_type: ps.pricing_type || "fixed",
              service_status: ps.service_status ?? true,
              description: ps.description || "",
              completed_tasks: ps.completed_tasks ?? 0,
            },
            questions: questionAnswerEntities,
            createdAt: ps.createdAt,
            updatedAt: ps.updatedAt,
          };
        })
      );

      return enrichedServices;
    } catch (err) {
      throw new Error("Unable to retrieve professional services");
    }
  }

  async updateProfessionalServiceByProAndService(
    proServiceId,
    newServiceId,
    updateData
  ) {
    if (!mongoose.Types.ObjectId.isValid(proServiceId)) {
      throw new Error(
        "Valid proServiceId (_id of ProfessionalService) is required"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(newServiceId)) {
      throw new Error("Valid serviceId is required");
    }
    // Assign new service_id to updateData
    updateData.service_id = newServiceId;

    const updated = await ProfessionalServicesModel.findByIdAndUpdate(
      proServiceId,
      updateData,
      { new: true }
    );

    if (!updated) {
      throw new Error("Professional service not found with the given ID");
    }

    return updated;
  }

  async deleteProfessionalService(proServiceId) {
    if (!mongoose.Types.ObjectId.isValid(proServiceId)) {
      throw new Error("Valid proServiceId is required");
    }

    // 1️⃣ Find the professional service
    const proService = await ProfessionalServicesModel.findById(proServiceId);
    if (!proService) {
      throw new Error("Professional service not found with the given ID");
    }

    const { professional_id, location_ids, question_ids } = proService;

    // 2️⃣ Delete all related answers
    await answerModel.deleteMany({
      professional_id,
      question_id: { $in: question_ids || [] },
    });

    // 3️⃣ Delete all related locations
    if (Array.isArray(location_ids) && location_ids.length > 0) {
      await LocationModel.deleteMany({ _id: { $in: location_ids } });
    }

    const deleted = await ProfessionalServicesModel.findByIdAndDelete(
      proServiceId
    );

    if (!deleted) {
      throw new Error("Professional service not found with the given ID");
    }

    return deleted;
  }

  // Adde service pricing for professional service
  async addServicePricing(professional_id, service_id, pricingData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(professional_id)) {
        throw new Error("A valid professional_id is required.");
      }
      if (!mongoose.Types.ObjectId.isValid(service_id)) {
        throw new Error("A valid service_id is required.");
      }
      const updatedService = await professionalServicesModel.findOneAndUpdate(
        { professional_id, service_id },
        { $set: pricingData },
        { new: true, runValidators: true }
      );
      if (!updatedService) {
        return {
          success: false,
          message: "No matching professional service found to update.",
        };
      }
      return {
        success: true,
        message: "Service pricing added successfully.",
        data: updatedService,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error updating service pricing.",
        error: error?.message || "An unexpected error occurred.",
      };
    }
  }



  
  async getProfessionalServiceDetails(professional_id, service_id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(professional_id)) {
        throw new Error("A valid professional_id is required.");
      }
      if (!mongoose.Types.ObjectId.isValid(service_id)) {
        throw new Error("A valid service_id is required.");
      }
      const service = await professionalServicesModel
        .findOne({ professional_id, service_id })
        .populate("location_ids")
        .populate("question_ids")
        .lean();

      if (!service) {
        return {
          success: false,
          message: "No professional service found for this Professional.",
        };
      }

      return {
        success: true,
        message: "Professional service details retrieved successfully.",
        data: service,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error retrieving professional service details.",
        error: error?.message || "An unexpected error occurred.",
      };
    }
  }




  async updateServicePricing(professionalId, serviceId, updateData) {
    if (!professionalId) {
      throw new Error("A valid professional_id is required.");
    }
    if (!serviceId) {
      throw new Error("A valid service_id is required.");
    }

    const professionalService = await ProfessionalServicesModel.findOne({
      professional_id: professionalId,
      service_id: serviceId,
    });

    if (!professionalService) {
      throw new Error(
        "Professional service not found for the given professional and service IDs"
      );
    }

    const allowedFields = [
      "maximum_price",
      "minimum_price",
      "description",
      "pricing_type",
      "completed_tasks",
    ];

    let isUpdated = false;
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        professionalService[field] = updateData[field];
        isUpdated = true;
      }
    }

    if (!isUpdated) {
      throw new Error("No valid fields provided for update");
    }

    const updatedService = await professionalService.save();
    return updatedService;
  }
}

export default new ServicesService();

// get Professional Services or All services of Professional
export async function getProfessionalServices(userId) {
  try {
    const professional = await Professional.findOne({ user_id: userId });
    if (!professional) {
      return { success: false, message: "Professional not found" };
    }
    const services = await ProfessionalServicesModel.find({
      professional_id: professional._id,
    }).lean();
    return {
      success: true,
      professional,
      services: services,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving professional services",
      error: error.message,
    };
  }
}

// Update Professional Service Status

// =================================================
//           Manage Services
// =================================================

export async function updateServiceStatus(serviceId, newStatus) {
  try {
    const updated = await ServiceModel.findByIdAndUpdate(
      serviceId,
      { is_active: newStatus },
      { new: true }
    );

    return updated;
  } catch (error) {
    throw error;
  }
}

export async function updateFeaturedService(serviceId, isFeatured) {
  try {
    const updated = await ServiceModel.findByIdAndUpdate(
      serviceId,
      { is_featured: isFeatured },
      { new: true } // returns updated document
    );

    return updated;
  } catch (error) {
    throw error;
  }
}

export async function updateService(serviceId, updateData) {
  return await ServiceModel.findByIdAndUpdate(serviceId, updateData, {
    new: true,
  });
}

export async function updateServiceStatusServices(
  professional_id,
  service_id,
  service_status
) {
  try {
    const service = await professionalServicesModel.findOneAndUpdate(
      { professional_id, service_id },
      { service_status },
      { new: true, runValidators: true }
    );
    if (!service) {
      return {
        success: false,
        message: "No matching service found to update",
      };
    }
    return {
      success: true,
      message: "Service status updated successfully",
      data: service,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error updating professional service status",
      error: error.message,
    };
  }
}

// Create New Service - Professional
export async function CreateNewServiceProfessional(data) {
  const { professional_id, service_id, service_name } = data;
  try {
    if (!professional_id || !service_id || !service_name) {
      throw new Error("All fields are required.");
    }
    const existingService = await professionalServicesModel.findOne({
      professional_id,
      service_id,
    });
    if (existingService) {
      throw new Error("This service already exists for this professional.");
    }
    const professional = await professionalServicesModel.create({
      professional_id,
      service_id,
      service_name,
    });
    return professional;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to create new professional service."
    );
  }
}

/**
 * Fetch all questions for a given service ID
 * @param {string} serviceId
 * @returns {Promise<Array>} Array of questions
 */
export const fetchServiceQuestionsByServiceId = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required.");
    }
    const questions = await questionModel
      .find({ service_id: serviceId })
      .sort({ created_at: 1 });
    return questions;
  } catch (error) {
    throw new Error(error?.message || "Failed to fetch service questions.");
  }
};

// Submit service answers for a professional and service
export const submitServiceAnswers = async (
  answers,
  professional_id,
  service_id
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const professionalService = await ProfessionalServicesModel.findOne({
      professional_id: professional_id,
      service_id: service_id,
    }).session(session);
    if (!professionalService) {
      throw new Error(
        "Professional service not found for this professional and service ID."
      );
    }
    const questionIds = answers.map(
      (a) => new mongoose.Types.ObjectId(a.question_id)
    );
    professionalService.question_ids = questionIds;
    await professionalService.save({ session });
    const answerDocs = answers.map((a) => ({
      professional_id: professional_id,
      service_id: service_id,
      question_id: new mongoose.Types.ObjectId(a.question_id),
      answers: a.answer,
    }));
    await answerModel.insertMany(answerDocs, { session });
    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Service answers submitted successfully.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error?.message || "Failed to submit service answers.");
  }
};

// Create Service Location for Professional Service
export const createServiceLocationServices = async (payload) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      professional_id,
      service_id,
      lat,
      lng,
      city,
      state,
      radius_miles,
      radiusMiles,
      country,
      address_line,
    } = payload;

    if (!professional_id || !service_id) {
      throw new Error("professional_id and service_id are required.");
    }
    const radius = radius_miles || radiusMiles;
    let zipcodes = [];
    if (radius && radius > 0) {
      const radiusRadians = radius / 3958.8;
      const nearbyZips = await zipcodeModel
        .find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusRadians],
            },
          },
        })
        .session(session);
      zipcodes = nearbyZips.map((z) => z.zip);
    }
    const locationData = {
      type: "professional",
      professional_id,
      service_id,
      country: country || "USA",
      state: state || "",
      city: city || "",
      zipcode: zipcodes,
      address_line: address_line || "",
      coordinates: { type: "Point", coordinates: [lng, lat] },
      serviceRadiusMiles: radius || 0,
    };
    const [locationDoc] = await LocationModel.create([locationData], {
      session,
    });
    const service = await ProfessionalServicesModel.findOneAndUpdate(
      { professional_id, service_id },
      { $addToSet: { location_ids: locationDoc._id } },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Service Location Saved successfully.",
      location: locationDoc,
      service,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to save location");
  }
};

// Deleting Service of professional
export const deleteProfessionalService = async ({
  professional_id,
  service_id,
}) => {
  try {
    if (!professional_id || !service_id) {
      throw new Error("Professional ID and Service ID are required.");
    }
    const existingService = await professionalServicesModel.findOne({
      professional_id,
      service_id,
    });
    if (!existingService) {
      throw new Error("Service not found for this professional.");
    }
    const deletedService = await professionalServicesModel.findOneAndDelete({
      professional_id,
      service_id,
    });
    return {
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to delete professional service.");
  }
};
