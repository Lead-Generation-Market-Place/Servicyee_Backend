import Location from "../models/LocationModel.js";


export function createLocation(data) {
    const location = new Location(data);
    return location.save();
}

export function getAllLocations() {
  return Location.find().exec(); // no limit, returns all
}