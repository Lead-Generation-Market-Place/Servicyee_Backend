import Professional from "../models/ProfessionalModel.js";
import Location from "../models/LocationModel.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import ProfessionalService from "../models/professionalServicesModel.js";
import questionModel from "../models/questionModel.js";
import professionalServicesModel from "../models/professionalServicesModel.js";
import Answer from "../models/answerModel.js";
import LocationModel from "../models/LocationModel.js";

export function createProfessional(data) {
  const professional = new Professional(data);
  return professional.save();
}

export function getProfessionalByUserId(user_id) {
  return Professional.findOne({ user_id }).exec();
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
    const existingUser = await User.findOne({
      email: data.email,
    }).session(session);
    if (existingUser) throw new Error("User already exists in this email");

    const hashedPassword = await bcrypt.hash(data.password.trim(), 12);
    const user = new User({
      username: data.firstName + data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    });
    await user.save({ session });

    const professional = new Professional({
      user_id: user._id,
      business_name: data.username,
      website: data.website || "",
    });
    await professional.save({ session });

    await Location.create({
      type: "professional",
      professional_id: professional._id,
      country: data.country,
      address_line: data.streetAddress,
      city: data.city,
      state: data.region,
      zipcode: data.postalCode,
    });
    const serviceObjectIds = data.services_id
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const professionalServices = serviceObjectIds.map((serviceId) => ({
      professional_id: professional._id,
      service_id: serviceId,
    }));

    await ProfessionalService.insertMany(professionalServices, { session });
    await session.commitTransaction();
    session.endSession();
    const GetProfessional = await Professional.findById(professional._id)
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
      { business_name: business_name.trim() },
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
      { business_hours, timezone },
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
    const servicesWithQuestions = serviceIds.map((sid) => ({
      service_id: sid,
      questions: questions
        .filter((q) => q.service_id.toString() === sid.toString())
        .sort((a, b) => a.order - b.order),
    }));
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
      zip,
      radiusMiles,
      country,
      address_line,
    } = data;

    if (!professional_id) throw new Error("Professional ID is required.");
    if (!service_id) throw new Error("Service ID is required.");
    const service = await ProfessionalService.findOne({
      professional_id,
      service_id,
    }).session(session);

    if (!service) {
      throw new Error(
        "Professional service not found for this professional ID and service ID."
      );
    }

    let savedLocation;

    if (service.location_ids && service.location_ids.length > 0) {
      const locationId = service.location_ids[0];

      savedLocation = await Location.findByIdAndUpdate(
        locationId,
        {
          professional_id,
          country: country || "USA",
          state: state || "",
          city: city || "",
          zipcode: zip || "",
          address_line: address_line || "",
          coordinates: {
            type: "Point",
            coordinates: [lng, lat],
          },
          serviceRadiusMiles: radiusMiles || 0,
        },
        { new: true, session }
      );
    } else {
      const location = new Location({
        type: "professional",
        professional_id,
        country: country || "USA",
        state: state || "",
        city: city || "",
        zipcode: zip || "",
        address_line: address_line || "",
        coordinates: {
          type: "Point",
          coordinates: [lng, lat],
        },
        serviceRadiusMiles: radiusMiles || 0,
      });

      savedLocation = await location.save({ session });

      service.location_ids.push(savedLocation._id);
      await service.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return savedLocation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      error.message || "Failed to create or update professional location"
    );
  }
}



// Create Professional Account - Profile Account - Reviews
export async function createProfessionalAccountReview(professional_id) {

  if (!professional_id) throw new Error("Professional ID is required.");

  try {
    const professional = await Professional.findById(professional_id).lean();
    if (!professional) throw new Error("Professional not found");
    const professionalServices = await ProfessionalService.find({ professional_id })
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
          answer: matchedAnswer ? matchedAnswer.answer : null, // include answer if available
        };
      }),
    }));
    return {
      success: true,
      message: "Professional account review fetched successfully",
      professional,
      services: answeredQuestions,
      locations,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching professional review",
      error: error.message,
    };
  }
}
