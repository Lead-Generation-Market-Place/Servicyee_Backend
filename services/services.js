import servicesModel from "../models/servicesModel.js";
import ServiceModel from "../models/servicesModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import LocationModel  from "../models/LocationModel.js";
class ServicesService {
  async getAllServices() {
    return await ServiceModel.find({});
  }

  async addService(serviceData) {
    const newService = new ServiceModel(serviceData);
    return await newService.save();
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


async serviceLocations() {
  try {
    const result = await Service.aggregate([
      {
        // Only include services with valid location_id (ObjectId)
        $match: {
          location_id: { $type: 'objectId' }
        }
      },
      {
        $group: {
          _id: '$location_id',
          professionalsSet: { $addToSet: '$professional_id' }
        }
      },
      {
        $project: {
          professionalsCount: { $size: '$professionalsSet' }
        }
      },
      {
        $lookup: {
          from: 'locations',
          localField: '_id',
          foreignField: '_id',
          as: 'locationDetails'
        }
      },
      {
        $unwind: {
          path: '$locationDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          location_id: '$_id',
          professionalsCount: 1,
          city: '$locationDetails.city'
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Error fetching service locations:', error);
    throw error;
  }
}
}

export default new ServicesService();
