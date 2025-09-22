import servicesModel from "../models/servicesModel.js";
import ServiceModel from "../models/servicesModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import LocationModel  from "../models/LocationModel.js";

import ProfessionalServicesModel from '../models/professionalServicesModel.js';

class ServicesService {
  async getAllServices() {
    return await ServiceModel.find({});
  }

  async addService(serviceData) {
  const { service_name, subcategory_id } = serviceData;

  const existingService = await ServiceModel.findOne({
    service_name: service_name.trim(),
    subcategory_id
  });

  if (existingService) {
    throw new Error('Service already exists under this subcategory');
  }

  const newService = new ServiceModel(serviceData);
  return await newService.save();
}



 async assignServiceToProfessional(professionalServiceData) {
  const {
    professional_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_availability,
    pricing_type
  } = professionalServiceData;

  const existingAssignment = await ProfessionalServicesModel.findOne({
    professional_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_availability,
    pricing_type
  });

  if (existingAssignment) {
    throw new Error('Service already assigned to this professional at this location');
  }
const newAssignment =  new ProfessionalServicesModel(professionalServiceData);
return await newAssignment.save();

}

  // Optional: list assigned services for a professional
  async getAssignedServicesForProfessional(professional_id) {
    return await ProfessionalServicesModel.find({ professional_id })
      .populate('service_id')
      .populate('location_id');
  }


  async getServiceById(serviceId) {
    return await ServiceModel.findById(serviceId);
  }

  async updateService(serviceId, updateData) {
    return await ServiceModel.findByIdAndUpdate(serviceId, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteService(serviceId) {
    return await ServiceModel.findByIdAndDelete(serviceId);
  }

  async getServicesOfProfessional(professionalId) {
    return await ServiceModel.find({ professional_id: professionalId });
  }

  async addServiceForSubCategory(serviceData) {
    const subcategoryExists = await subCategoryModel.findById(serviceData.subcategory_id);
    if (!subcategoryExists) {
      throw new Error("SubCategory not found");
    }

    const newService = new ServiceModel(serviceData);
    return await newService.save();
  }


// async searchServiceByLocation(service_id, zip_code) {
//   const query = {};

//   if (service_id) {
//     query._id = service_id;
//   }

//   if (zip_code) {
//     const locations = await LocationModel.find({ zipcode: zip_code }).select('_id');
//     const locationIds = locations.map(loc => loc._id);
//     if (locationIds.length === 0) {
//       return [];
//     }
//     query.location_id = { $in: locationIds };
//   }

//   const services = await ServiceModel.find(query).populate('location_id');

//   return services;
// }

async getAllServiceLocationWithProCount() {
  try {
    const result = await Service.aggregate([
      {
        // Filter services with valid ObjectId location_id and optional active status
        $match: {
          location_id: { $type: 'objectId' },
          service_status: true // Optional: Only include active services
        }
      },
      {
        // Group by location_id, collecting unique professional_ids
        $group: {
          _id: '$location_id',
          uniqueProfessionals: { $addToSet: '$professional_id' }
        }
      },
      {
        // Project count of unique professionals
        $project: {
          location_id: '$_id',
          _id: 0,
          professionalsCount: { $size: '$uniqueProfessionals' }
        }
      },
      {
        // Lookup location details
        $lookup: {
          from: 'locations',
          localField: 'location_id',
          foreignField: '_id',
          as: 'locationDetails'
        }
      },
      {
        // Flatten the location details array
        $unwind: {
          path: '$locationDetails',
          preserveNullAndEmptyArrays: true // Keeps result even if location is not found
        }
      },
      {
        // Final projected result
        $project: {
          location_id: 1,
          professionalsCount: 1,
          city: '$locationDetails.city',
          state: '$locationDetails.state', // Add more fields if needed
          country: '$locationDetails.country'
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Error in getAllServiceLocationWithProCount:', error);
    throw error;
  }
}

}

export default new ServicesService();
