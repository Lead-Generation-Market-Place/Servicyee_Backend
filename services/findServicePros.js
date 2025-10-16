import mongoose from "mongoose";
import Professional from "../models/ProfessionalModel.js";
import professionalServices from "../models/professionalServicesModel.js";
import services from "../models/servicesModel.js";
import searches from "../models/searchModel.js";
class FindServicePros {
  async getProfessionalsByService(serviceId) {
    try {
      const pros = await professionalServices
        .find({
          service_id: serviceId,
        })
        .populate({
          path: "professional_id",
          select: "business_name introduction business_type profile_image total_hire total_review rating_avg",
          populate: {
            path: "user_id",
            select: "username email",
          },
        })
        .populate({
          path: "service_id",
          select: "service_name service_status",
        })
        .populate({
          path: "location_ids",
        })
        .populate({
          path: "question_ids",
        })
        .limit(5)
        .exec();
      return pros;
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsDetailsByService(professionalId) {
    try {
      const pro = await Professional.findById(professionalId)
        .populate({
          path: "user_id",
          select: "username email",
        })
        .exec();
      return pro;
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsByServiceHighestRating(serviceId, limit = 5) {
    try {
      // First, get professional IDs for this service, sorted by rating
      const serviceListings = await professionalServices
        .find({
          service_id: serviceId,
          service_status: true,
        })
        .populate({
          path: "professional_id",
          select: "rating_avg", // Only get rating for sorting
        })
        .sort({ "professional_id.rating_avg": -1 }) // Sort by rating descending
        .limit(limit)
        .lean()
        .exec();

      // If no results found, return empty array
      if (!serviceListings || serviceListings.length === 0) {
        return [];
      }

      // Extract professional IDs in the sorted order
      const professionalIds = serviceListings
        .filter((sl) => sl.professional_id) // Filter out null professionals
        .map((sl) => sl.professional_id._id);

      // Now get the full details for these professionals in the sorted order
      const professionals = await professionalServices
        .find({
          service_id: serviceId,
          professional_id: { $in: professionalIds },
          service_status: true,
        })
        .populate({
          path: "professional_id",
          select:
            "business_name introduction business_type profile_image website founded_year employees total_hire total_review rating_avg portfolio business_hours specializations user_id",
          populate: {
            path: "user_id",
            select: "username email phone profile_picture",
          },
        })
        .populate({
          path: "service_id",
          select: "service_name service_status service_description",
          model: services,
        })
        .populate({
          path: "location_ids",
          select: "country state city address_line zipcode coordinates",
        })
        .exec();

      // Manual sorting to maintain the rating order
      const sortedProfessionals = professionals.sort((a, b) => {
        const ratingA = a.professional_id?.rating_avg || 0;
        const ratingB = b.professional_id?.rating_avg || 0;
        return ratingB - ratingA; // Descending order
      });

      return sortedProfessionals;
    } catch (error) {
      throw error;
    }
  }

  async getProsAndCompaniesByServiceHighestRating(serviceId, filters = {}) {
    try {
      const {
        businessType, // 'professional' or 'company'
        minRating = 0,
        minHires = 0,
        minReviews = 0,
        limit = 5,
      } = filters;

      // Build the base query
      let query = professionalServices.find({
        service_id: serviceId,
        service_status: true,
      });

      // Professional population with all fields from your data
      const professionalPopulate = {
        path: "professional_id",
        select:
          "business_name introduction business_type website founded_year employees total_hire total_review rating_avg profile_image portfolio business_hours specializations payment_methods user_id",
        populate: {
          path: "user_id",
          select: "username email phone profile_picture",
        },
      };

      // Add business type filter if provided
      if (businessType) {
        professionalPopulate.match = {
          business_type: businessType,
          ...professionalPopulate.match,
        };
      }

      // Add rating filter
      if (minRating > 0) {
        professionalPopulate.match = {
          ...professionalPopulate.match,
          rating_avg: { $gte: minRating },
        };
      }

      // Add minimum hires filter
      if (minHires > 0) {
        professionalPopulate.match = {
          ...professionalPopulate.match,
          total_hire: { $gte: minHires },
        };
      }

      // Add minimum reviews filter
      if (minReviews > 0) {
        professionalPopulate.match = {
          ...professionalPopulate.match,
          total_review: { $gte: minReviews },
        };
      }

      query = query.populate(professionalPopulate);

      // Add other populations
      query = query.populate({
        path: "service_id",
        select: "service_name service_status service_description",
        model: services,
      });

      query = query.populate({
        path: "location_id",
        select: "country state city address_line zipcode coordinates",
      });

      // Get results
      const results = await query.exec();

      // Filter out documents where professional_id is null (due to population filters)
      const filteredResults = results.filter(
        (item) => item.professional_id !== null
      );

      // Sort by rating_avg (highest first), then by total_review, then by total_hire
      filteredResults.sort((a, b) => {
        const ratingA = a.professional_id?.rating_avg || 0;
        const ratingB = b.professional_id?.rating_avg || 0;

        // First sort by rating
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }

        // If ratings are equal, sort by reviews
        const reviewsA = a.professional_id?.total_review || 0;
        const reviewsB = b.professional_id?.total_review || 0;
        if (reviewsB !== reviewsA) {
          return reviewsB - reviewsA;
        }

        // If reviews are equal, sort by hires
        const hiresA = a.professional_id?.total_hire || 0;
        const hiresB = b.professional_id?.total_hire || 0;
        return hiresB - hiresA;
      });

      // Apply limit
      return filteredResults.slice(0, limit);
    } catch (error) {
      throw error;
    }
  }
   async getServicesByNameZip(serviceId, zipCode) {
    try {
      // Step 1: Find professionals that match the service ID and zip code
      const pros = await professionalServices
        .find({
          service_id: serviceId,
        })
        .populate({
          path: "professional_id",
          select: "business_name introduction business_type profile_image",
        })
        .populate({
          path: "service_id",
          select: "service_name",
        })
        .populate({
          path: "location_ids",
          match: { zipcode: zipCode },
        })
        .exec();

      // Step 2: Filter only those that have at least one matching location
      const filteredPros = pros.filter(
        (pro) => pro.location_ids && pro.location_ids.length > 0
      );

      // Step 3: Store the search in the `searches` table
      // Avoid duplicates (optional, depends on your design)
      const existingSearch = await searches.findOne({ service_id: serviceId, zip_code: zipCode });

      if (!existingSearch) {
        await searches.create({
          service_id: serviceId,
          zip_code: zipCode,
        });
      }

      return filteredPros;
    } catch (error) {
      throw error;
    }
  }
}

export default new FindServicePros();
