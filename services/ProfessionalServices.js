import Professional from "../models/ProfessionalModel.js";
import Location from "../models/LocationModel.js";

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
