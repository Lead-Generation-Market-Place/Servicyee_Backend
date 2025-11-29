import Professional from "../models/ProfessionalModel.js";
import Location from "../models/LocationModel.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import ProfessionalService from "../models/professionalServicesModel.js";
import questionModel from "../models/questionModel.js";
import professionalServicesModel from "../models/professionalServicesModel.js";
import Answer from "../models/answerModel.js";
import FeaturedProject from "../models/featuredProjectModel.js";

import Faq from "../models/faqModel.js";
import FaqQuestion from "../models/faqquestionsModel.js";
import Zipcode from "../models/zipcodeModel.js";
import ProfessionalLicense from "../models/ProfessionalLicenseModel.js";


import Review from "../models/ReviewModel.js";
import zipcodeModel from "../models/zipcodeModel.js";
import servicesModel from "../models/servicesModel.js";
import ProMedia from "../models/proMediaModel.js";

import professionalLeadModel from "../models/professionalLeadModel.js";
import CreditTransactionModel from "../models/CreditTransactionModel.js";


export function createProfessional(data) {
  const professional = new Professional(data);
  return professional.save();
}

export function getProfessionalByUserId(user_id) {
  return Professional.findOne({ user_id }).exec();
}
// Fetch Professional Leads....

export async function getProfessionalLeadsByUserId(user_id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      throw new Error("Invalid user ID");
    }
    const professional = await Professional.findOne({ user_id }).lean();

    if (!professional) {
      return {
        success: false,
        message: "Professional not found",
        professional: null,
        professionalServices: [],
        professionalLeads: [],
      };
    }

    const professional_id = professional._id;
    const professionalServices = await ProfessionalService.find({
      professional_id,
    }).lean();

    const credits = await CreditTransactionModel.find({
      professional_id,
    }).lean();
    const reviews = await Review.find({ professional_id })
      .populate({
        path: "user_id",
        select: "username email", // choose fields you want
      })
      .sort({ createdAt: -1 }) // latest reviews first
      .lean();

    const professionalLeads = await professionalLeadModel
      .find({
        professional_id,
        status: "accepted",
      })
      .populate("lead_id")
      .lean();

    return {
      success: true,
      message: "Professional data fetched successfully",
      professional,
      professionalServices,
      professionalLeads,
      credits,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching professional data:", error);
    return {
      success: false,
      message: "Failed to fetch professional data",
      error: error.message,
      professional: null,
      professionalServices: [],
      professionalLeads: [],
    };
  }
}

export function getAllProfessionals(limit = 10) {
  return Professional.find().limit(limit).exec();
}

export function updateProfessional(id, data) {
  return Professional.findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deleteProfessional(id) {
  return Professional.findByIdAndDelete(id).exec();
}

export function updateProfessionalIntroductionById(id, data) {
  return Professional.findByIdAndUpdate(
    id,
    { introduction: data.introduction },
    { new: true, runValidators: true }
  );
}

export async function updateProfessionalService(id, data) {
  if (data.payment_methods) {
    if (!Array.isArray(data.payment_methods)) {
      data.payment_methods = [data.payment_methods];
    }
  }
  const {
    business_name,
    founded_year,
    employees,
    website,
    payment_methods,
    address_line,
    zipcode,
    profile_image,
  } = data;

  const professionalUpdate = {
    business_name,
    founded_year,
    employees,
    website,
    payment_methods,
  };
  if (profile_image) professionalUpdate.profile_image = profile_image;

  const professional = await Professional.findByIdAndUpdate(
    id,
    professionalUpdate,
    { new: true, runValidators: true }
  );

  if (!professional) return null;

  const locationUpdate = { address_line, zipcode };
  const location = await Location.findOneAndUpdate(
    { user_id: professional.user_id },
    locationUpdate,
    { new: true, runValidators: true, upsert: true }
  );

  return { professional, location };
}

// Create Professional Account Step 01
export async function CreateProAccountStepOne(data) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email: data.email }).session(
      session
    );
    if (existingUser) throw new Error("User already exists with this email");
    const hashedPassword = await bcrypt.hash(data.password.trim(), 12);
    const user = await User.create(
      [
        {
          username: data.firstName + data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
        },
      ],
      { session }
    );
    const newUser = user[0];
    const professional = await Professional.create(
      [
        {
          user_id: newUser._id,
          business_name: data.username,
          website: data.website || "",
          step: 1,
        },
      ],
      { session }
    );
    const newProfessional = professional[0];
    await Location.create(
      [
        {
          type: "professional",
          professional_id: newProfessional._id,
          country: data.country,
          address_line: data.streetAddress,
          city: data.city,
          state: data.region,
          zipcode: data.postalCode,
        },
      ],
      { session }
    );
    const serviceObjectIds = data.services_id
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    const services = await servicesModel
      .find({ _id: { $in: serviceObjectIds } })
      .select("_id name")
      .lean()
      .session(session);
    const serviceNameMap = {};
    services.forEach((s) => {
      serviceNameMap[s._id.toString()] = s.name;
    });
    const professionalServices = serviceObjectIds.map((serviceId) => ({
      professional_id: newProfessional._id,
      service_id: serviceId,
      service_name: serviceNameMap[serviceId.toString()] || "",
    }));
    console.log("the service data is", professionalServices);
    await ProfessionalService.insertMany(professionalServices, { session });
    await session.commitTransaction();
    session.endSession();
    const GetProfessional = await Professional.findById(newProfessional._id)
      .populate("user_id")
      .lean();

    return { professional: GetProfessional };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to create professional account");
  }
}

// End of Professional Account Step 01

// Create Professional Account Step 03
export async function CreateProAccountStepThree(id, { business_name }) {
  if (
    !business_name ||
    typeof business_name !== "string" ||
    !business_name.trim()
  ) {
    throw new Error(
      "Business name is required and must be a least 3 character."
    );
  }
  try {
    const professional = await Professional.findByIdAndUpdate(
      id,
      { business_name: business_name.trim(), step: 3 },
      { new: true, runValidators: true }
    );
    if (!professional) {
      throw new Error("Professional not found.");
    }

    return professional;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to update professional business name."
    );
  }
}

// Create Professional Account Step 04
export async function CreateProAccountStepFour(
  id,
  { businessType, employees, founded, about, profile }
) {
  try {
    const updateData = {
      business_type: businessType.trim(),
      employees: employees !== undefined ? employees : undefined,
      founded_year: founded !== undefined ? founded : undefined,
      introduction: about !== undefined ? about : undefined,
      step: 4,
    };

    if (profile) {
      updateData.profile_image = profile;
    }
    const professional = await Professional.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!professional) {
      throw new Error("Professional not found.");
    }
    return professional;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to update professional business info."
    );
  }
}

// Create Professional Account Step 07
export async function createProAccountStepSeven(id, { schedule, timezone }) {
  try {
    const business_hours = schedule.flatMap((day) =>
      day.shifts.map((shift) => ({
        day: day.dayOfWeek,
        status: shift.isClosed ? "close" : "open",
        start_time: shift.isClosed
          ? null
          : new Date(`1970-01-01T${shift.openTime}:00Z`),
        end_time: shift.isClosed
          ? null
          : new Date(`1970-01-01T${shift.closeTime}:00Z`),
      }))
    );
    const professional = await Professional.findByIdAndUpdate(
      id,
      { business_hours, timezone, step: 7 },
      { new: true, runValidators: true }
    );
    if (!professional) {
      throw new Error("Professional not found.");
    }
    return professional;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to update professional business info."
    );
  }
}

// Get Professional Services Questions for Registeration Step 08
export async function getProServicesQuestions(professionalId) {
  try {
    const proServices = await ProfessionalService.find({
      professional_id: professionalId,
    }).select("service_id");

    if (!proServices.length) {
      throw new Error("No services found for this professional.");
    }
    const serviceIds = proServices.map((s) => s.service_id);
    const questions = await questionModel
      .find({ service_id: { $in: serviceIds } })
      .select("service_id question_name form_type options required order");
    const servicesWithQuestions = serviceIds
      .map((sid) => {
        const serviceQuestions = questions
          .filter((q) => q.service_id.toString() === sid.toString())
          .sort((a, b) => a.order - b.order);
        return {
          service_id: sid,
          questions: serviceQuestions,
        };
      })
      .filter((service) => service.questions.length > 0); // Only keep services with questions

    return {
      success: true,
      services: servicesWithQuestions,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching service questions");
  }
}
// End of Get Service Question

// Create Professional Services - Step 08
export async function createProfessionalServicesAnswers(
  professionalId,
  serviceId,
  { answers }
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let profService = await professionalServicesModel
      .findOne({
        professional_id: new mongoose.Types.ObjectId(professionalId),
        service_id: new mongoose.Types.ObjectId(serviceId),
      })
      .session(session);

    if (!profService) {
      profService = new professionalServicesModel({
        professional_id: new mongoose.Types.ObjectId(professionalId),
        service_id: new mongoose.Types.ObjectId(serviceId),
        question_ids: [],
      });
    }
    const operations = [];

    for (const a of answers) {
      const questionId = new mongoose.Types.ObjectId(a.question_id);
      if (
        !profService.question_ids
          .map((q) => q.toString())
          .includes(questionId.toString())
      ) {
        profService.question_ids.push(questionId);
      }
      operations.push({
        updateOne: {
          filter: {
            professional_id: new mongoose.Types.ObjectId(professionalId),
            question_id: questionId,
          },
          update: {
            $set: {
              professional_id: new mongoose.Types.ObjectId(professionalId),
              service_id: new mongoose.Types.ObjectId(serviceId),
              question_id: questionId,
              answers: a.answer,
            },
          },
          upsert: true,
        },
      });
    }
    if (operations.length > 0) {
      await Answer.bulkWrite(operations, { session });
    }
    await profService.save({ session });

    const professional = await Professional.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(professionalId) },
      { step: 8 }, // update
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    const updatedAnswers = await Answer.find({
      professional_id: new mongoose.Types.ObjectId(professionalId),
      service_id: new mongoose.Types.ObjectId(serviceId),
    });

    return updatedAnswers;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      error?.message || "Failed to save professional service answers."
    );
  }
}

// End of Step 08

export async function createProAccountStepNine(data) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      professional_id,
      service_id,
      lat,
      lng,
      city,
      state,
      radiusMiles,
      country,
      address_line,
    } = data;

    if (!professional_id || !service_id) {
      throw new Error("professional_id and service_id are required.");
    }
    let zipcodes = [];
    if (radiusMiles && radiusMiles > 0) {
      const radiusMeters = radiusMiles * 1609.34;
      const nearbyZips = await zipcodeModel
        .find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusMeters / 6378137],
            },
          },
        })
        .session(session);
      zipcodes = nearbyZips.map((z) => z.zip);
    }

    const locationData = {
      type: "professional",
      professional_id,
      service_id,
      country: country || "USA",
      state: state || "",
      city: city || "",
      zipcode: zipcodes,
      address_line: address_line || "",
      coordinates: { type: "Point", coordinates: [lng, lat] },
      serviceRadiusMiles: radiusMiles || 0,
    };

    const existingLocation = await Location.findOne({
      professional_id,
      service_id,
    }).session(session);

    let locationDoc;

    if (existingLocation) {
      Object.assign(existingLocation, locationData);
      locationDoc = await existingLocation.save({ session });
    } else {
      const [newLocation] = await Location.create([locationData], { session });
      locationDoc = newLocation;
    }
    const service = await ProfessionalService.findOneAndUpdate(
      { professional_id, service_id },
      { location_ids: [locationDoc._id] },
      { new: true, session }
    );
    await Professional.findOneAndUpdate(
      { _id: professional_id },
      { step: 9 },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Location saved successfully.",
      location: locationDoc,
      service,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to save location");
  }
}

export async function createProfessionalReview(professional_id) {
  if (!professional_id) throw new Error("Professional ID is required.");

  try {
    const professional = await Professional.findById(professional_id).lean();
    if (!professional) throw new Error("Professional not found");
    const professionalServices = await ProfessionalService.find({
      professional_id,
    })
      .populate({
        path: "question_ids",
        model: "Question",
        select: "question_name form_type options required order active",
      })
      .lean();
    const locations = await Location.find({ professional_id }).lean();
    const answersData = await Answer.find({ professional_id })
      .populate({
        path: "question_id",
        model: "Question",
        select: "question_name form_type options required order active",
      })
      .lean();

    const answers = answersData.map((a) => ({
      answer_id: a._id,
      professional_id: a.professional_id,
      question: a.question_id,
      answer: a.answers,
    }));
    const answeredQuestions = professionalServices.map((service) => ({
      ...service,
      answered_questions: service.question_ids.map((q) => {
        const matchedAnswer = answers.find(
          (ans) => ans.question?._id?.toString() === q._id?.toString()
        );
        return {
          ...q,
          answer: matchedAnswer ? matchedAnswer.answer : null,
        };
      }),
    }));

    const reviews = await Review.find({ professional_id })
      .populate({
        path: "user_id",
        model: "User",
        select: "email username",
      })
      .lean();
    return {
      success: true,
      message: "Professional account review fetched successfully",
      professional,
      services: answeredQuestions,
      locations,
      reviews,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching professional review",
      error: error.message,
    };
  }
}
//Noor Ahmad Bashery
export async function getProfessionalProfileSummary(userId) {
  const professional = await Professional.findOne({ user_id: userId });
  console.info("Professional Profile Summary:", professional);
  if (!professional) {
    throw new Error("Professional not found");
  }
  return professional;
}

// FeaturedProject Service Methods
export async function createFeaturedProject(data) {
  const {
    serviceId,
    cityname,
    projectTitle,
    approximate_total_price,
    duration,
    year,
    description,
    fileIds,
  } = data;

  const featuredProject = new FeaturedProject({
    serviceId,
    cityname,
    projectTitle,
    approximate_total_price,
    duration: {
      type: duration.type,
      value: duration.value,
    },
    year,
    description,
    fileIds: fileIds || [],
  });

  return featuredProject.save();
}

// =======================================================
//          Professional featured project services
// =======================================================
export const createFeaturedProjectService = async (projectData, files) => {
  try {
    const featuredProject = await FeaturedProject.create(projectData);
    console.log("featured project id: ", featuredProject._id);
    if (files && files.length > 0) {
      const imageEntries = files.map(file => ({
        professionalId: projectData.professional_id,
        projectId: featuredProject._id,
        fileUrl: `/uploads/promedia/${file.filename}`,
        type: "image",
        source: "featured"
      }));
      await ProMedia.insertMany(imageEntries);
    }

    return featuredProject;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

export const getProFeaturedProjectService = async (professional_id) => {
  try {

    // Validate professional_id
    if (!professional_id) {
      throw new Error('Professional ID is required');
    }

    const [featuredProjects, projectMedia] = await Promise.all([
      // Get featured projects
      FeaturedProject.find({
        professional_id: professional_id,
        isActive: true
      })
      .sort({ createdAt: -1 })
      .lean(),

      // Get media for all featured projects in parallel
      (async () => {
        const projects = await FeaturedProject.find({
          professional_id: professional_id,
          isActive: true
        }).select('_id').lean();
        
        if (projects.length === 0) return [];
        
        const projectIds = projects.map(p => p._id);
        return ProMedia.find({
          projectId: { $in: projectIds },
          source: "featured",
          isActive: true
        })
        .sort({ createdAt: -1 })
        .lean();
      })()
    ]);

    // Return empty array if no featured projects found
    if (featuredProjects.length === 0) {
      return [];
    }

    // Create a map for faster media lookup
    const mediaMap = new Map();
    projectMedia.forEach(media => {
      const key = media.projectId.toString();
      if (!mediaMap.has(key)) {
        mediaMap.set(key, []);
      }
      mediaMap.get(key).push(media);
    });

    

    // Combine projects with their media
    const result = featuredProjects.map(project => ({
      ...project,
      media: mediaMap.get(project._id.toString()) || []
    }));

    return result;

  } catch (error) {
    console.error('Error in getProFeaturedProjectService:', error);
    throw error;
  }
}




// Simple FAQ Service Methods (Only What You Need)


export async function addQuestion(questionText) {
  const faqQuestion = new FaqQuestion({
    question: questionText.trim()
  });
  return faqQuestion.save();
}

export class FaqService {
  static async getProfessionalFaq(professionalId) {
    // Fetch all FAQ questions
    const questions = await FaqQuestion.find({}).lean();

    // Fetch all answers from the professional
    const answers = await Faq.find({
      professional_id: professionalId,
    }).lean();


    // Merge results
    const result = questions.map((q) => {
      const answerObj = answers.find(
        (a) => a.question_id.toString() === q._id.toString()
      );

      return {
        question_id: q._id,
        question: q.question,
        answer: answerObj ? answerObj.answer : null,
      };
    });

    return result;
  }
}

export async function addAnswers(answersData) {
  const faqPromises = answersData.map(answerData => {
    const faq = new Faq({
      question_id: answerData.question_id,
      professional_id: answerData.professional_id,
      answer: answerData.answer.trim()
    });
    return faq.save();

  });
  
  return Promise.all(faqPromises);
}

export async function updateOrCreateAnswers(answersData) {
  const bulkOperations = answersData.map(answerData => {
    const filter = { 
      question_id: answerData.question_id, 
      professional_id: answerData.professional_id 
    };
    
    const update = {
      $set: {
        answer: answerData.answer.trim(),
        updatedAt: new Date()
      }
    };

    return {
      updateOne: {
        filter: filter,
        update: update,
        upsert: true // Create if doesn't exist
      }
    };
  });

  const result = await Faq.bulkWrite(bulkOperations);
  return result;
}

export async function getFaqsByProfessional(professionalId) {
  // Get all questions with their answers for this professional
  const questions = await FaqQuestion.find().sort({ createdAt: -1 }).lean();

  const answers = await Faq.find({
    professional_id: professionalId,
  }).lean();

  // Map answers to questions
  const questionsWithAnswers = questions.map((question) => {
    const answer = answers.find(
      (a) => a.question_id.toString() === question._id.toString()
    );
    return {
      ...question,
      answer: answer ? answer.answer : null,
      faq_id: answer ? answer._id : null,
    };
  });

  return questionsWithAnswers;
}

// Methods for dropdown data (License Types and Cities)

export async function getAllLicenseTypes() {
  try {
    const LicenseType = mongoose.model("LicenseType");
    return await LicenseType.find().select("_id name").sort({ name: 1 });
  } catch (error) {
    throw new Error(error.message || "Failed to fetch license types");
  }
}

export async function getAllCities() {
  try {
    const states = await Zipcode.aggregate([
      {
        $group: {
          _id: "$state_name",
          id: { $first: "$_id" },
        },
      },
      {
        $project: {
          _id: "$id",
          state_name: "$_id",
        },
      },
      {
        $sort: { state_name: 1 },
      },
    ]);

    return states;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch cities");
  }
}

// Helper function to convert state_name to zipcode_id
export async function getZipcodeIdByStateName(state_name) {
  const zipcodeDoc = await Zipcode.findOne({ state_name });
  if (!zipcodeDoc) {
    throw new Error(`No zipcode found for state: ${state_name}`);
  }
  return zipcodeDoc._id;
}

// Helper function to get state_name from frontend "city" field
export function convertCityToStateName(city) {
  // Handle the case where frontend sends "city" but means state_name
  if (typeof city === "string" && city.length > 2) {
    return city; // Assume it's a state name if it's longer than 2 chars
  }
  return city; // Return as-is if it's already a state name or code
}

// Helper function to extract state_name from either city or state_name field
export function getStateNameFromRequest(data) {
  // Frontend can send either "city" or "state_name" field
  return data.city || data.state_name;
}

// Professional License Methods
export async function saveProfessionalLicense(data) {
  console.log("Service function called with data:", data);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!data) {
      throw new Error("Data parameter is required");
    }

    const {
      professional_id,
      state_id,
      license_type_id,
      license_owner_name,
      license_expiration,
      link_to_licensing_agency,
      status = "pending",
      zipcode_id, // <-- Added (you were missing this)
    } = data;

    let finalZipcodeId = zipcode_id;

    // If zipcode_id is not provided but state_name or city is provided, resolve zipcode
    if (!finalZipcodeId) {
      if (typeof getStateNameFromRequest !== "function") {
        throw new Error("getStateNameFromRequest() is not defined");
      }
      if (typeof getZipcodeIdByStateName !== "function") {
        throw new Error("getZipcodeIdByStateName() is not defined");
      }

      const stateName = getStateNameFromRequest(data);
      if (stateName) {
        finalZipcodeId = await getZipcodeIdByStateName(stateName);
      }
    }

    // Validate required fields
    if (
      !professional_id ||
      !license_type_id ||
      !finalZipcodeId ||
      !license_owner_name ||
      !license_expiration
    ) {
      throw new Error(
        "professional_id, license_type_id, zipcode_id, license_owner_name, and license_expiration are required"
      );
    }

    // Validate status enum
    const validStatuses = ["pending", "active", "approved"];
    if (status && !validStatuses.includes(status)) {
      throw new Error("status must be one of: pending, active, approved");
    }

    // Create the license record
    const professionalLicense = new ProfessionalLicense({
      professional_id,
      state_id,
      license_type_id,
      zipcode_id: finalZipcodeId, // <-- Add zipcode to DB
      license_owner_name,
      license_expiration: new Date(license_expiration),
      link_to_licensing_agency,
      status,
    });

    const savedLicense = await professionalLicense.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedLicense;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to save professional license");
  }
}

// Get all professional licenses
export async function getAllProfessionalLicenses(professional_id) {
  try {
    const licenses = await ProfessionalLicense.find({
      professional_id: new mongoose.Types.ObjectId(professional_id),
    })
      .populate({
        path: "zipcode_id",
        select: "city state_name zip",
      })
      .populate({
        path: "license_type_id",
        select: "name",
      })
      .lean();

    return licenses;
    const [latestLicense] = await ProfessionalLicense.find({
      professional_id: new mongoose.Types.ObjectId(professional_id),
    })
      .populate({
        path: "state_id",
        select: "city state_name zip",
      })
      .populate({
        path: "license_type_id",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    return latestLicense;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch professional licenses");
  }
}

// Get specific professional license
export async function getProfessionalLicenseById(professional_id, license_id) {
  try {
    const license = await ProfessionalLicense.findOne({
      _id: new mongoose.Types.ObjectId(license_id),
      professional_id: new mongoose.Types.ObjectId(professional_id),
    })
      .populate({
        path: "zipcode_id",
        select: "state_name",
      })
      .populate({
        path: "license_type_id",
        select: "name",
      })
      .lean();

    if (!license) {
      throw new Error("Professional license not found");
    }

    return license;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch professional license");
  }
}
// Update professional license
export async function updateProfessionalLicense(
  professional_id,
  license_id,
  updateData
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      license_type_id,
      zipcode_id,
      license_owner_name,
      license_expiration,
      link_to_licensing_agency,
      status,
    } = updateData;

    let finalZipcodeId = zipcode_id;

    // If zipcode_id is not provided but state_name or city is provided, get zipcode_id
    if (!zipcode_id) {
      const stateName = getStateNameFromRequest(updateData);
      if (stateName) {
        finalZipcodeId = await getZipcodeIdByStateName(stateName);
      }
    }

    // Prepare update object with schema field names
    const updateObj = {};
    if (license_type_id) updateObj.license_type_id = license_type_id;
    if (finalZipcodeId) updateObj.zipcode_id = finalZipcodeId;
    if (license_owner_name) updateObj.license_owner_name = license_owner_name;
    if (license_expiration)
      updateObj.license_expiration = new Date(license_expiration);
    if (link_to_licensing_agency !== undefined)
      updateObj.link_to_licensing_agency = link_to_licensing_agency;
    if (status !== undefined) {
      // Validate status enum values
      const validStatuses = ["pending", "active", "approved"];
      if (status && !validStatuses.includes(status)) {
        throw new Error("status must be one of: pending, active, approved");
      }
      updateObj.status = status;
    }

    const updatedLicense = await ProfessionalLicense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(license_id),
        professional_id: new mongoose.Types.ObjectId(professional_id),
      },
      updateObj,
      { new: true, runValidators: true, session }
    )
      .populate({
        path: "zipcode_id",
        select: "city state_name zip",
      })
      .populate({
        path: "license_type_id",
        select: "name",
      });

    if (!updatedLicense) {
      throw new Error("Professional license not found");
    }

    await session.commitTransaction();
    session.endSession();

    return updatedLicense;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to update professional license");
  }
}

// Delete professional license
export async function deleteProfessionalLicense(professional_id, license_id) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedLicense = await ProfessionalLicense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(license_id),
      professional_id: new mongoose.Types.ObjectId(professional_id),
    }).session(session);

    if (!deletedLicense) {
      throw new Error("Professional license not found");
    }

    await session.commitTransaction();
    session.endSession();

    return deletedLicense;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Failed to delete professional license");
  }
}

// update Business

// services/professionalAvailabilityService.js
export async function updateProfessionalAvailabilityService(
  professionalId,
  { isAvailable, hiddenUntil }
) {
  const updateData = {};
  if (isAvailable === false) {
    updateData.is_available = false;

    if (hiddenUntil) {
      const hiddenUntilDate = new Date(hiddenUntil);
      if (isNaN(hiddenUntilDate.getTime())) {
        throw new Error("Invalid hidden until date format");
      }
      if (hiddenUntilDate <= new Date()) {
        throw new Error("Hidden until date must be in the future");
      }

      updateData.hidden_until = hiddenUntilDate;
    }
  }
  if (isAvailable === true) {
    updateData.is_available = true;
    updateData.hidden_until = null;
    updateData.auto_reactivate_at = null;
  }
}

export const updateProfessionalProfileView = async (professional_id) => {
  if (!professional_id) throw new Error("Professional ID is required.");

  try {
    const professional = await Professional.findById(professional_id).lean();
    if (!professional) throw new Error("Professional not found");
    const updatedProfessional = await Professional.findByIdAndUpdate(
      professional_id,
      { $inc: { profile_views: 1 } },
      { new: true }
    ).lean();
    return {
      success: true,
      message: "Professional profile view tracked successfully",
      professional: updatedProfessional,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error tracking professional profile view",
      error: error.message,
    };
  }
};
// ===============================================
//            Pro Medial Services
// ===============================================

export const uploadProMediaService = async (mediaArray) => {
  try {
    const savedMedia = await ProMedia.insertMany(mediaArray);
    return savedMedia;
  } catch (error) {
    console.error("Error in uploadProMediaService:", error);
    throw error;
  }
};

export const getProMediaService = async (proId) => {
  return ProMedia.find({ professionalId: proId }).exec();
};

