// servicesService.js
import ServiceModel from "../models/servicesModel.js";
import ProfessionalServicesModel from "../models/professionalServicesModel.js";
import answerModel from "../models/answerModel.js";

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
      subcategory_id
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
    service_id
  });

  if (existing) {
    throw new Error("You already saved this service.");
  }

  const newAssignment = new ProfessionalServicesModel({
    professional_id,
    service_id
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
      new: true
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
            service_availability: true
          }
        },
        {
          $group: {
            _id: "$location_id",
            professionalCount: { $addToSet: "$professional_id" }
          }
        },
        {
          $project: {
            location_id: "$_id",
            professionalCount: { $size: "$professionalCount" }
          }
        },
        {
          $lookup: {
            from: "locations",
            localField: "location_id",
            foreignField: "_id",
            as: "location"
          }
        },
        { $unwind: "$location" },
        {
          $group: {
            _id: "$location.state",
            totalProfessionals: { $sum: "$professionalCount" }
          }
        },
        {
          $project: {
            state: "$_id",
            totalProfessionals: 1,
            _id: 0
          }
        },
        { $sort: { totalProfessionals: -1 } }
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
async getAllServicesOfAProfessional(professionalId) {
  if (!professionalId) {
    throw new Error('Professional ID is required');
  }

  // Fetch only service_id with name and subcategory (category) with name
  const services = await ProfessionalServicesModel.find({ professional_id: professionalId })
    .populate({
      path: 'service_id',
      select: 'name subcategory_id',
      populate: {
        path: 'subcategory_id',
        select: 'name',
      }
    })
    .sort({ createdAt: -1 })
    .lean();

  if (!services.length) return [];

  // Map to only return service and subcategory name info
  return services.map(service => ({
    service_id: service.service_id._id,
    service_name: service.service_id.name,
    category_name: service.service_id.subcategory_id?.name || null,
  }));
}


}


export default new ServicesService();
