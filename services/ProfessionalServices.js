import Professional from '../models/ProfessionalModel.js';

export function createProfessional(data) {
  const professional = new Professional(data);
  return professional.save();
}

export function getProfessionalById(id) {
  return Professional.findById(id)
    .select()
    .exec();
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
