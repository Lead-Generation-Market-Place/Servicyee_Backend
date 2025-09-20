import searchModel from "../models/searchModel.js";
import LocationModel from "../models/LocationModel.js";
import ServiceModel from "../models/servicesModel.js";
import Professional from "../models/ProfessionalModel.js"; // import the Professional model

class Search {

  async searchServiceByLocation(service_id, zip_code, searchText) {
    // 1. Save the search
    await searchModel.create({ service_id, zip_code });

    // 2. Build query for exact match
    const query = {};

    if (service_id) {
      query._id = service_id;
    }

    if (zip_code) {
      // Get locations with this zip_code
      const locations = await LocationModel.find({ zipcode: zip_code }).select('_id');
      const locationIds = locations.map(loc => loc._id);
      if (locationIds.length === 0) {
        // no locations match zip, return suggestions below
        return await this.getProfessionalsFromServices(await this.getServiceSuggestions(searchText, zip_code));
      }
      query.location_id = { $in: locationIds };
    }

    // Try exact match first
    let services = await ServiceModel.find(query).populate('location_id');

    // 3. If no exact matches, get suggestions based on searchText or nearby locations
    if (!services.length) {
      services = await this.getServiceSuggestions(searchText, zip_code);
    }

    // 4. Get professionals related to the matched services
    const professionals = await this.getProfessionalsFromServices(services);

    return professionals;
  }

  async getServiceSuggestions(searchText, zip_code) {
    const query = {};

    if (searchText && searchText.length >= 2) {
      query.description = { $regex: searchText, $options: 'i' };
    }

    if (zip_code) {
      const locations = await LocationModel.find({ zipcode: zip_code }).select('_id');
      const locationIds = locations.map(loc => loc._id);
      if (locationIds.length > 0) {
        query.location_id = { $in: locationIds };
      }
    }

    const suggestions = await ServiceModel.find(query).limit(10).populate('location_id');

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
}

export default new Search();
