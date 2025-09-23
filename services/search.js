import searchModel from "../models/searchModel.js";
import LocationModel from "../models/LocationModel.js";
import ServiceModel from "../models/servicesModel.js";
import mongoose from "mongoose";
import ProfessionalServices from "../models/professionalServicesModel.js"; // import the ProfessionalServices model

class Search {
async searchServiceByLocation(service_id, zip_code, searchText) {
  // Log the search
  if (service_id && zip_code) {
    await searchModel.create({ service_id, zip_code });
  }

  const matchStage = {
    service_id: new mongoose.Types.ObjectId(service_id)
  };

  const pipeline = [
    {
      $match: matchStage
    },
    {
      $lookup: {
        from: 'locations',
        localField: 'location_id',
        foreignField: '_id',
        as: 'location'
      }
    },
    {
      $unwind: '$location'
    },
    {
      $match: {
        'location.zipcode': zip_code
      }
    },
    {
      $lookup: {
        from: 'professionals',
        localField: 'professional_id',
        foreignField: '_id',
        as: 'professional'
      }
    },
    {
      $unwind: '$professional'
    },
    {
      $lookup: {
        from: 'services',
        localField: 'service_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    {
      $unwind: '$service'
    }
  ];

  // If searchText is provided, filter by description
  if (searchText && searchText.length >= 2) {
    pipeline.push({
      $match: {
        description: { $regex: searchText, $options: 'i' }
      }
    });
  }

  const result = await ProfessionalServices.aggregate(pipeline);

  // Return just the professionals
  return result.map(r => r.professional);
}


 async getServiceSuggestions(searchText, zip_code) {
  const query = {};

  if (searchText && searchText.length >= 2) {
    query.description = { $regex: searchText, $options: 'i' };
  }

  if (zip_code) {
    const locations = await LocationModel.find({
      zipcode: zip_code,
      type: 'service'
    }).select('_id');

    const locationIds = locations.map(loc => loc._id);

    if (locationIds.length > 0) {
      query.location_id = { $in: locationIds };
    }
  }

  const suggestions = await ServiceModel.find(query)
    .limit(10)
    .populate('location_id');

  return suggestions;
}

  // New helper: get Professionals for the given list of services
  async getProfessionalsFromServices(services) {
    if (!services.length) return [];

    // Extract all service IDs from the services list
    const serviceIds = services.map(service => service._id);

    // Query Professionals who have any of these service IDs in their specializations
    const professionals = await Professional.find({
      'specializations.service_id': { $in: serviceIds }
    }).lean();

    return professionals;
  }
  
async getAllPopularSearchByUserLocation(zipCode) {
  if (!zipCode) {
    throw new Error('zipCode is required');
  }

  const numericZip = Number(zipCode);
  const existing = await searchModel.find({ zip_code: numericZip });


  const popularServices = await searchModel.aggregate([
    {
      $match: {
        zip_code: numericZip
      }
    },
    {
      $group: {
        _id: '$service_id',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: 'services', // <-- must match collection name
        localField: '_id',
        foreignField: '_id',
        as: 'serviceDetails'
      }
    },
    {
      $unwind: '$serviceDetails'
    },
    {
      $project: {
        _id: 0,
        service_id: '$_id',
        count: 1,
        service_name: '$serviceDetails.service_name'
      }
    }
  ]);

  return popularServices;
}


}

export default new Search();
