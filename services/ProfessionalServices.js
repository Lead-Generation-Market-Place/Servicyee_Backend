import Professional from "../models/ProfessionalModel.js";
import Location from "../models/LocationModel.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import ProfessionalService from "../models/professionalServicesModel.js";

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
    return { user, professional: GetProfessional };
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
export async function CreateProAccountStepFour(id, { businessType, employees, founded, about, profile }) {
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
    const professional = await Professional.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!professional) {
      throw new Error("Professional not found.");
    }
    return professional;
  } catch (error) {
    throw new Error(error?.message || "Failed to update professional business info.");
  }
}