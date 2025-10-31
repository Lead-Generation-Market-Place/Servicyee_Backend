import LocationModel from "../models/LocationModel.js";
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
    .populate('mile_id', 'mile') 
    .populate('minute_id', 'minute') 
    .populate('vehicle_type_id', 'vehicle_type')  
    .lean()
    .exec();

  const transformedLocations = locations.map(location => {
    return {
      ...location,
      mile: location.mile_id?.mile || null,
      mile_id: location.mile_id?._id || null,

      minute: location.minute_id?.minute || null,
      minute_id: location.minute_id?._id || null,

      vehicleType: location.vehicle_type_id?.vehicle_type || null,
      vehicle_type_id: location.vehicle_type_id?._id || null
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

// user location fetch and insert

export async function insertUserLocationById(data, userId) {
  try {
    // Create location with user association
    const locationData = {
      ...data,
      user_id: userId
    };
    
    const location = new Location(locationData);
    const savedLocation = await location.save();
    return savedLocation;
  } catch (error) {
    throw new Error(`Failed to insert user location: ${error.message}`);
  }
}

export async function getUserLocationById(userId) {
  try {
    const location = await Location.findOne({user_id: userId });
    return location;
  } catch (error) {
    throw new Error(`Failed to get user location: ${error.message}`);
  }
}

//=======================================================
// Get count of professionals grouped by city and state.
//=======================================================
export const getProCountByLocation = async () => {
  const result = await Location.aggregate([
    // Only count documents that belong to professionals
    { $match: { type: "professional", professional_id: { $ne: null } } },

    // Group by city and state
    {
      $group: {
        _id: {
          city: "$city",
        },
        professionalCount: { $sum: 1 }
      }
    },

    // Reshape the output
    {
      $project: {
        _id: 0,
        city: "$_id.city",
        state: "$_id.state",
        professionalCount: 1
      }
    },

    // Optional: sort by count descending
    { $sort: { professionalCount: -1 } }
  ]);

  return result;
};