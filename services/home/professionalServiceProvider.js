import ProfessionalService from "../../models/professionalServicesModel.js";
import Professional from "../../models/ProfessionalModel.js";
import Location from "../../models/LocationModel.js";
import mongoose from "mongoose";

export const getTopProfessionalsByServiceAndZip = async (service_id, zipcode) => {
  try {
    // 1️⃣ Find the single location for this zipcode
    console.log(`looking for service: ${service_id} and zipcode: ${ zipcode}`);
    const location = await Location.findOne({ 
      zipcode: zipcode,
      type:"professional"
    }).select("_id");

    if (!location) {
      return [];
    }
    
    // 2️⃣ Find all professionals offering that service in this location
    const locationId = location._id.toString();
    const results = await ProfessionalService.aggregate([
      {
        $match: {
          service_status: true,
          service_id: new mongoose.Types.ObjectId(service_id),
          location_ids: locationId,  // ✅ matches if locationId exists inside array
        },
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professional_id",
          foreignField: "_id",
          as: "professional",
        },
      },
      { $unwind: "$professional" },
      {
        $sort: { "professional.rating_avg": -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          service_name: 1,
          description: 1,
          minimum_price: 1,
          maximum_price: 1,
          pricing_type: 1,
          completed_tasks: 1,
          "professional._id": 1,
          "professional.business_name":1,
          "professional.business_type": 1,
          "professional.introduction":1,
          "professional.total_hire":1,
          "professional.total_review":1,
          "professional.profile_image": 1,
          "professional.rating_avg": 1,
        },
      },
    ]);
    console.log("this is the result: ", results);

    return results;
  } catch (error) {
    console.error("Error fetching top professionals:", error);
    throw error;
  }
};
