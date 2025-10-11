import Location from "../models/LocationModel.js";


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

export function getLocationServiceByProfessionalId(professionalId){
  const location = Location.find({professional_id:professionalId}).exec();
  return location;
}