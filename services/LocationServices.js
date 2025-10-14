import Location from "../models/LocationModel.js";
import milesModel from "../models/milesModel.js";


export async function createLocation(data) {
  const location = new Location(data);
  const savedLocation = await location.save();
  return savedLocation._id; 
}

export function getAllLocations() {
  return Location.find().exec(); 
}

export function updateLcoation(id,data) {
    return Location.findByIdAndUpdate(id, data, {new: true}).exec();
}

export function getLocationById(id) {
    return Location.findById(id).select()
    .exec();
}

export function deleteLocationById(id) {
    return Location.findByIdAndDelete(id).exec();
}

// Get Location by userId
export function GetLocationByUserId(user_id) {
    const location = Location.findOne({ user_id }).exec();
    return location;
}

export function getLocationServiceByProfessionalId(professionalId,serviceId){
  const location = Location.find({professional_id:professionalId,service_id:serviceId}).exec();
  return location;
}

export function getAllMiles() {
  return milesModel.find().select('mile _id').exec();
}


export async function addMiles(data) {
  const miles = new milesModel(data);
  await miles.save(); // No need to return anything
}
