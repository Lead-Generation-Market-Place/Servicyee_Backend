import servicesModel from "../models/servicesModel.js";
import ServiceModel from "../models/servicesModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import LocationModel  from "../models/LocationModel.js";
import AnswerModel from "../models/answerModel.js";
import ProfessionalServicesModel from '../models/professionalServicesModel.js';
import { professionalSchema } from "../validators/professionalValidator.js";
import professionalServicesModel from "../models/professionalServicesModel.js";

class ServicesService {
  async getAllServices() {
    return await ServiceModel.find({});
  }

  async addService(serviceData) {
    try {
      const { name, slug, subcategory_id } = serviceData;
      if (!name || !slug || !subcategory_id) {
        throw new Error('Name, slug, and subcategory_id are required fields.');
      }
      const existingService = await ServiceModel.findOne({
        slug: slug.trim(),
        subcategory_id
      });
      if (existingService) {
        throw new Error('Service already exists under this subcategory');
      }
      const newService = new ServiceModel(serviceData);
      return await newService.save();

    } catch (error) {
      console.error('Error in addService:', error);
    throw error;
    }
}

async assignServiceToProfessional(professionalServiceData) {
  const {
    professional_id,
    user_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_availability,
    pricing_type,
    business_hours,
    description,
    answers = [],
    ...rest
  } = professionalServiceData;

  // ✅ 1. Prevent duplicate assignment (based on key fields)
  const existingAssignment = await ProfessionalServicesModel.findOne({
    professional_id,
    service_id,
    location_id
  });

  if (existingAssignment) {
    throw new Error('Service already assigned to this professional at this location');
  }

  // ✅ 2. Save individual answers in the `Answer` collection
  if (Array.isArray(answers) && answers.length > 0) {
    const answerDocs = answers.map((ans) => ({
      question_id: ans.question_id,
      professional_id,
      user_id,  // Assumes you're passing `user_id` in the request body
      answers: ans.answer
    }));

    await AnswerModel.insertMany(answerDocs);
  }

  // ✅ 3. Save full Professional Service with embedded answers
  const newAssignment = new ProfessionalServicesModel({
    professional_id,
    user_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_status: true,
    service_availability,
    pricing_type,
    completed_tasks: 0,
    business_hours,
    description,
    answers: answers.map(ans => ({
      question_id: ans.question_id,
      answer: ans.answer 
    })),
    ...rest
  });

  return await newAssignment.save();
}async assignServiceToProfessional(professionalServiceData) {
  const {
    professional_id,
    user_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_availability,
    pricing_type,
    business_hours,
    description,
    answers = [],
    ...rest
  } = professionalServiceData;

  // ✅ 1. Prevent duplicate assignment
  const existingAssignment = await ProfessionalServicesModel.findOne({
    professional_id,
    service_id,
    location_id
  });

  if (existingAssignment) {
    throw new Error('Service already assigned to this professional at this location');
  }

  // ✅ 2. Save answers to `AnswerModel`, and collect their IDs
  let embeddedAnswers = [];

  if (Array.isArray(answers) && answers.length > 0) {
    const answerDocs = await Promise.all(
      answers.map(async (ans) => {
        const savedAnswer = await AnswerModel.create({
          question_id: ans.question_id,
          professional_id,
          user_id,
          answers: ans.answer
        });

        // Store the reference for embedding
        return {
          question_id: ans.question_id,
          answer: savedAnswer._id
        };
      })
    );

    embeddedAnswers = answerDocs;
  }

  // ✅ 3. Save professional service with embedded answer references
  const newAssignment = new ProfessionalServicesModel({
    professional_id,
    user_id,
    service_id,
    location_id,
    maximum_price,
    minimum_price,
    service_status: true,
    service_availability,
    pricing_type,
    completed_tasks: 0,
    business_hours,
    description,
    answers: embeddedAnswers, // { question_id, answer (ObjectId) }
    ...rest
  });

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
    return await ServiceModel.findByIdAndUpdate(serviceId, updateData);
  }

  async deleteService(serviceId) {
    return await ServiceModel.findByIdAndDelete(serviceId);
  }

  async getServicesOfProfessional(professionalId) {
    return await ServiceModel.find({ professional_id: professionalId });
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

  getAllPopularServiceLocationWithProCount = async () => {
  try {

    console.log("Starting aggregation for popular service locations with professional counts...");
    const result = await professionalServicesModel.aggregate([
      {
        // Match only active services (optional, based on your logic)
        $match: {
          service_status: true,
          service_availability: true
        }
      },
      {
        // Group by location_id and count distinct professional_id
        $group: {
          _id: '$location_id',
          professionalCount: { $addToSet: '$professional_id' }
        }
      },
      {
        // Convert the set to count
        $project: {
          location_id: '$_id',
          professionalCount: { $size: '$professionalCount' }
        }
      },
      {
        // Join with locations collection to get state info
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
        // Group by state
        $group: {
          _id: '$location.state',
          totalProfessionals: { $sum: '$professionalCount' }
        }
      },
      {
        // Format output
        $project: {
          state: '$_id',
          totalProfessionals: 1,
          _id: 0
        }
      },
      {
        // Sort by count descending
        $sort: { totalProfessionals: -1 }
      }
    ]);

        if(result.length === 0){
     
      return 'No popular service locations found.';
    }

      else{

        return result;
      }

  } catch (error) {
    console.error('Error in getAllPopularServiceLocationWithProCount:', error);
    throw error;
  }
};

async activeInactiveServiceToggle(serviceId, status) {
  const service = await ServiceModel.findById(serviceId);
  if (!service) {
    throw new Error('Service not found');
  }
  service.service_status = status;
  return await service.save();  
}
}

export default new ServicesService();
