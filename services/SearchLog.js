import mongoose from "mongoose";
import ProfessionalService from "../models/professionalServicesModel.js";


export async function searchProfessionals(zipCode, serviceName, limit = 20, skip = 0) {
  try {
    const results = await ProfessionalService.aggregate([
      // Step 1: Join with services and filter by service name
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service_info",
        },
      },
      { $unwind: "$service_info" },
      {
        $match: {
          "service_info.service_name": { $regex: serviceName, $options: "i" },
          service_status: true,
        },
      },

      // Step 2: Join with professionals
      {
        $lookup: {
          from: "professionals",
          localField: "professional_id",
          foreignField: "_id",
          as: "professional_info",
        },
      },
      { $unwind: "$professional_info" },

      // Step 3: Join with locations (to filter by ZIP code)
      {
        $lookup: {
          from: "locations",
          let: { pid: "$professional_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$professional_id", "$$pid"] }, zipcode: zipCode } },
          ],
          as: "location_info",
        },
      },

      // Step 4: Keep only those with at least one matching location
      { $match: { location_info: { $ne: [] } } },

      // Step 5: Shape the response
      {
        $project: {
          _id: 0,
          professional_service: {
            minimum_price: 1,
            maximum_price: 1,
            pricing_type: 1,
            description: 1,
            completed_tasks: 1,
          },
          professional: {
            _id: "$professional_info._id",
            business_name: "$professional_info.business_name",
            introduction: "$professional_info.introduction",
            business_type: "$professional_info.business_type",
            rating_avg: "$professional_info.rating_avg",
            total_review: "$professional_info.total_review",
            profile_image: "$professional_info.profile_image",
          },
          service: {
            _id: "$service_info._id",
            service_name: "$service_info.service_name",
            subcategory_id: "$service_info.subcategory_id",
          },
          location: {
            $arrayElemAt: ["$location_info", 0],
          },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    return results;
  } catch (error) {
    console.error("Error in searchProfessionals:", error);
    throw error;
  }
}
