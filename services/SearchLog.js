import ProfessionalService from "../models/professionalServicesModel.js";
export async function searchProfessionalsService(serviceName, zipcode) {
  const pipeline = [
    {
      $match: {
        service_status: true,
        service_name: { $regex: serviceName, $options: "i" },
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
      $lookup: {
        from: "locations",
        localField: "location_ids",
        foreignField: "_id",
        as: "locations",
      },
    },

    {
      $addFields: {
        matched_locations: {
          $filter: {
            input: "$locations",
            as: "loc",
            cond: { $eq: ["$$loc.zipcode", zipcode] },
          },
        },
      },
    },
    { $match: { "matched_locations.0": { $exists: true } } },

    { $sort: { "professional.rating_avg": -1, "professional.total_hire": -1 } },
  ];

  const results = await ProfessionalService.aggregate(pipeline);
  return results;
}
