import Location from "../models/LocationModel.js";
import milesModel from "../models/milesModel.js";
import minute_model from "../models/minute_model.js";
import vehicle_type_model from "../models/vehicle_type_model.js";


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

export async function deleteLocationById(id) {
  try {
    const res = await Location.findByIdAndDelete(id).exec();
    if (res) {
      console.log(`Location with ID ${id} was deleted.`);
    } else {
      console.log(`No location found with ID ${id}.`);
    }
    return res;
  } catch (error) {
    console.error(`Error deleting location with ID ${id}:`, error);
    throw error;
  }
}


// Get Location by userId
export function GetLocationByUserId(user_id) {
    const location = Location.findOne({ user_id }).exec();
    return location;
}

export async function getLocationServiceByProfessionalId(professionalId, serviceId) {
  const locations = await Location.find({ 
    professional_id: professionalId, 
    service_id: serviceId 
  })
  .populate('mile_id', 'mile') // Populate the mile field
  .lean() // Convert to plain JavaScript objects
  .exec();

  // Transform the data to include mile value
  const transformedLocations = locations.map(location => {
    return {
      ...location,
      mile: location.mile_id?.mile || null, // Add mile value directly
      mile_id: location.mile_id?._id || null // Keep the ID as well
    };
  });

  return transformedLocations;
}

export function getAllMiles() {
  return milesModel.find().select('mile _id').exec();
}


export async function addMiles(data) {
  const miles = new milesModel(data);
  await miles.save(); // No need to return anything
}


export async function addMinutes(data) {
  const minute = new minute_model(data);
  await minute.save();
}


export async function getAllMinutes(data) {
  return minute_model.find().select('minute _id');
  
}


export async function addVehileTypes(data) {
  const vehicelType = new vehicle_type_model(data);
  await vehicelType.save();
}


export async function getAllVehicleType(data) {
  return vehicle_type_model.find().select('vehicle_type _id');
  
}