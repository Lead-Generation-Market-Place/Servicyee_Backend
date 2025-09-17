import Location from "../models/LocationModel.js";


export function createLocation(data) {
    const location = new Location(data);
    return location.save();
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