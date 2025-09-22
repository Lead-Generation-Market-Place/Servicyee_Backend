import searchModel from "../models/searchModel.js";
import LocationModel from "../models/LocationModel.js";
import ServiceModel from "../models/servicesModel.js";

import ProfessionalServices from "../models/professionalServicesModel.js"; // import the ProfessionalServices model

class Search {

async searchServiceByLocation(service_id, zip_code, searchText) {
  // Save the search if both service_id and zip_code are provided
  if (service_id && zip_code) {
    await searchModel.create({ service_id, zip_code });
  }

  let query = {};

  // Always use both service_id and zip_code if provided
  if (service_id) {
    query.service_id = service_id;
  }

  if (zip_code) {
    query.zip_code = zip_code;
  }

  // If user is typing (searchText present), show suggestions reactively
  if (searchText && searchText.length >= 2) {
    // Find professional services matching the search text and zip code
    const professionalServices = await ProfessionalServices.find({
      service_id: service_id,
      zip_code: zip_code,
      description: { $regex: searchText, $options: 'i' }
    }).populate('professional_id service_id');

    return professionalServices.map(ps => ps.professional_id);
  }

  // Otherwise, try to find professional services matching service and location
  let professionalServices = await ProfessionalServices.find(query)
    .populate('professional_id service_id');

  // If no matches found, get suggestions based on searchText
  if (!professionalServices.length && searchText) {
    professionalServices = await ProfessionalServices.find({
      description: { $regex: searchText, $options: 'i' },
      zip_code: zip_code
    }).populate('professional_id service_id');
  }

  // Return professionals related to the found professional services
  return professionalServices.map(ps => ps.professional_id);
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
