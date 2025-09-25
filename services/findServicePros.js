import mongoose from "mongoose";
import Professional from "../models/ProfessionalModel.js";
import professionalServices from "../models/professionalServicesModel.js";

class findServicePros {
  async getProfessionalsByService(serviceId) {
    try {
      // Validate serviceId
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid service ID");
      }

      const objectIdServiceId = new mongoose.Types.ObjectId(serviceId);

      const pros = await professionalServices.aggregate([
        // Step 1: Match documents by service_id
        {
          $match: {
            service_id: objectIdServiceId,
            service_status: true // Add any additional filters you need
          }
        },

        // Step 2: Limit results
        { $limit: 5 },

        // Step 3: Lookup professional details with nested user population
        {
          $lookup: {
            from: "professionals", // MongoDB collection name
            let: { proId: "$professional_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$proId"] }
                }
              },
              {
                $project: {
                  business_name: 1,
                  introduction: 1,
                  business_type: 1,
                  profile_image: 1,
                  user_id: 1
                }
              },
              // Nested lookup for user details
              {
                $lookup: {
                  from: "users", // MongoDB collection name
                  let: { userId: "$user_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$userId"] }
                      }
                    },
                    {
                      $project: {
                        username: 1,
                        email: 1
                      }
                    }
                  ],
                  as: "user_id"
                }
              },
              { $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true } }
            ],
            as: "professional_id"
          }
        },

        // Step 4: Lookup service details
        {
          $lookup: {
            from: "services", // MongoDB collection name
            let: { servId: "$service_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$servId"] }
                }
              },
              {
                $project: {
                  service_name: 1,
                  service_status: 1
                }
              }
            ],
            as: "service_id"
          }
        },

        // Step 5: Lookup location details
        {
          $lookup: {
            from: "locations", // MongoDB collection name
            let: { locId: "$location_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$locId"] }
                }
              },
              {
                $project: {
                  country: 1,
                  state: 1
                }
              }
            ],
            as: "location_id"
          }
        },

        // Step 6: Unwind arrays to objects (like populate does)
        { $unwind: { path: "$professional_id", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$service_id", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$location_id", preserveNullAndEmptyArrays: true } },

        // Step 7: Filter out documents where professional_id is null (optional)
        {
          $match: {
            "professional_id": { $ne: null }
          }
        },

        // Step 8: Sort if needed (add your sorting criteria)
        { $sort: { createdAt: -1 } }
      ]);

      return pros;
    } catch (error) {
      throw error;
    }
  }

  
  async getProfessionalsDetailsByService(professionalId) {
    try {
      // Validate professionalId
      if (!mongoose.Types.ObjectId.isValid(professionalId)) {
        throw new Error("Invalid professional ID");
      }

      const objectIdProfessionalId = new mongoose.Types.ObjectId(professionalId);

      const pro = await Professional.aggregate([
        // Step 1: Match professional by ID
        {
          $match: {
            _id: objectIdProfessionalId
          }
        },

        // Step 2: Lookup user details
        {
          $lookup: {
            from: "users", // MongoDB collection name
            let: { userId: "$user_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$userId"] }
                }
              },
              {
                $project: {
                  username: 1,
                  email: 1,
                  phone: 1, // Add other fields you might need
                  profile_picture: 1
                }
              }
            ],
            as: "user_id"
          }
        },

        // Step 3: Lookup service listings for this professional
        {
          $lookup: {
            from: "professionalservices", // MongoDB collection name
            let: { proId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$professional_id", "$$proId"] },
                  service_status: true
                }
              },
              // Lookup service details for each service listing
              {
                $lookup: {
                  from: "services",
                  let: { serviceId: "$service_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$serviceId"] }
                      }
                    },
                    {
                      $project: {
                        service_name: 1,
                        service_description: 1
                      }
                    }
                  ],
                  as: "service_details"
                }
              },
              { $unwind: { path: "$service_details", preserveNullAndEmptyArrays: true } },
              
              // Lookup location details for each service listing
              {
                $lookup: {
                  from: "locations",
                  let: { locationId: "$location_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$locationId"] }
                      }
                    },
                    {
                      $project: {
                        country: 1,
                        state: 1,
                        city: 1,
                        address_line: 1
                      }
                    }
                  ],
                  as: "location_details"
                }
              },
              { $unwind: { path: "$location_details", preserveNullAndEmptyArrays: true } }
            ],
            as: "service_listings"
          }
        },

        // Step 4: Unwind user array to object
        { $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true } },

        // Step 5: Project final structure
        {
          $project: {
            business_name: 1,
            introduction: 1,
            business_type: 1,
            profile_image: 1,
            rating: 1,
            years_of_experience: 1,
            certifications: 1,
            user_id: 1,
            service_listings: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ]);

      // Return first result or null if not found
      return pro.length > 0 ? pro[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
 * Get all professionals for a service sorted by highest rating first
 * Uses rating_avg field from professionals collection
 * also this api returns the complete info because of multiple api response may slow down the server and maybe updated the api upon request
 */
async getProfessionalsByServiceHighestRating(serviceId, limit = 5) {
  try {
    // Validate serviceId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service ID");
    }

    const objectIdServiceId = new mongoose.Types.ObjectId(serviceId);

    const professionals = await professionalServices.aggregate([
      // Step 1: Match service listings by service_id
      {
        $match: {
          service_id: objectIdServiceId,
          service_status: true // Only active service listings
        }
      },

      // Step 2: Lookup professional details with rating
      {
        $lookup: {
          from: "professionals", // professionals collection
          let: { proId: "$professional_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$proId"] }
              }
            },
            {
              $project: {
                business_name: 1,
                introduction: 1,
                business_type: 1,
                website: 1,
                founded_year: 1,
                employees: 1,
                total_hire: 1,
                total_review: 1,
                rating_avg: 1,
                profile_image: 1,
                portfolio: 1,
                business_hours: 1,
                specializations: 1,
                user_id: 1,
                createdAt: 1,
                updatedAt: 1
              }
            }
          ],
          as: "professional"
        }
      },

      // Step 3: Lookup user details
      {
        $lookup: {
          from: "users", // users collection
          let: { userId: "$professional.user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] }
              }
            },
            {
              $project: {
                username: 1,
                email: 1,
                phone: 1,
                profile_picture: 1
              }
            }
          ],
          as: "user"
        }
      },

      // Step 4: Lookup service details
      {
        $lookup: {
          from: "services", // services collection
          let: { servId: "$service_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$servId"] }
              }
            },
            {
              $project: {
                service_name: 1,
                service_status: 1,
                service_description: 1
              }
            }
          ],
          as: "service"
        }
      },

      // Step 5: Lookup location details
      {
        $lookup: {
          from: "locations", // locations collection
          let: { locId: "$location_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$locId"] }
              }
            },
            {
              $project: {
                country: 1,
                state: 1,
                city: 1,
                address_line: 1,
                zipcode: 1,
                coordinates: 1
              }
            }
          ],
          as: "location"
        }
      },

      // Step 6: Unwind arrays to objects
      { $unwind: { path: "$professional", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },

      // Step 7: Filter out documents without professionals
      {
        $match: {
          "professional": { $ne: null }
        }
      },

      // Step 8: Sort by rating_avg (highest first)
      {
        $sort: {
          "professional.rating_avg": -1, // -1 for descending (highest first)
          "professional.total_review": -1, // Secondary sort by number of reviews
          "professional.total_hire": -1 // Tertiary sort by total hires
        }
      },

      // Step 9: Limit results
      { $limit: parseInt(limit) },

      // Step 10: Project final structure
      {
        $project: {
          // Service Listing Info
          _id: 1,
          description: 1,
          service_availability: 1,
          service_status: 1,
          pricing: 1,
          estimated_duration: 1,
          
          // Professional Info (with rating)
          professional: {
            _id: "$professional._id",
            business_name: "$professional.business_name",
            introduction: "$professional.introduction",
            business_type: "$professional.business_type",
            website: "$professional.website",
            founded_year: "$professional.founded_year",
            employees: "$professional.employees",
            total_hire: "$professional.total_hire",
            total_review: "$professional.total_review",
            rating_avg: "$professional.rating_avg", // The rating field
            profile_image: "$professional.profile_image",
            portfolio: "$professional.portfolio",
            business_hours: "$professional.business_hours",
            specializations: "$professional.specializations",
            createdAt: "$professional.createdAt",
            updatedAt: "$professional.updatedAt"
          },

          // User Info
          user: {
            _id: "$user._id",
            username: "$user.username",
            email: "$user.email",
            phone: "$user.phone",
            profile_picture: "$user.profile_picture"
          },

          // Service Info
          service: {
            _id: "$service._id",
            service_name: "$service.service_name",
            service_status: "$service.service_status",
            service_description: "$service.service_description"
          },

          // Location Info
          location: {
            _id: "$location._id",
            country: "$location.country",
            state: "$location.state",
            city: "$location.city",
            address_line: "$location.address_line",
            zipcode: "$location.zipcode",
            coordinates: "$location.coordinates"
          },

          // Timestamps
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    return professionals;
  } catch (error) {
    throw error;
  }
}
}

export default new findServicePros();