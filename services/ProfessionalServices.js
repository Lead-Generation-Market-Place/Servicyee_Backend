import Professional from '../models/ProfessionalModel.js';

export function createProfessional(data) {
  const professional = new Professional(data);
  return professional.save();
}

export function getProfessionalById(id) {
  return findById(id)
    .populate('specializations.service_id', 'name')
    .exec();
}

export function getAllProfessionals(limit = 10) {
  return find().limit(limit).exec();
}

export function updateProfessional(id, data) {
  return findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deleteProfessional(id) {
  return findByIdAndDelete(id).exec();
}
