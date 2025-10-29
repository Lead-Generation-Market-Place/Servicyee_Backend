
import {
  createLocation,
  deleteLocationById,
  getAllLocations,
  insertUserLocationById,
  getUserLocationById,
  getLocationById,
  updateLcoation,
  GetLocationByUserId,
  getLocationServiceByProfessionalId,
  getAllMiles,addMiles,
  getProCountByLocation,
  addMinutes,getAllMinutes,addVehileTypes,getAllVehicleType
} from "../services/LocationServices.js";

export async function createLocationHandler(req, res) {
  try {
    console.log(req.body);
    const locationId = await createLocation(req.body);
    res.status(201).json({ locationId });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Error creating location", error: error.message });
  }
}

export async function getLocationHandler(req, res) {
  try {
    const locations = await getAllLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Unable to get location", error });
  }
}

export async function updateLocationHandler(req, res) {
  try {
    const location = await updateLcoation(req.params.id, req.body);
    res.json(location);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating location",
      error: error?.message || "An Unexpected error occured",
    });
  }
}


export async function getLocationByUserIdHandler(req, res) {
  try {
    const user_id = req.user.id; 
    const location = await GetLocationByUserId(user_id);
         if (!location) {
      return res.json({
        address_line: "",
        zipcode: "",
      });
    }
    return res.json(location);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching location",
      error: error?.message || "An unexpected error occurred",
    });
  }
}


export async function getLocationByIdHandler(req, res) {
  try {
    const location = await getLocationById(req.params.id);
    res.json(location);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting location",
      error: error?.message || "An unexpected error occured",
    });
  }
}

export async function deleteLocationByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const deletedLocation = await deleteLocationById(id);

    if (!deletedLocation) {
      return res.status(404).json({
        success: false,
        message: `Location with ID ${id} not found.`,
      });
    }

    return res.json({
      message: `Location with ID ${id} is deleted.`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting location",
      error: error?.message || "An unexpected error occurred",
    });
  }
}


export async function getServiceLocationByProfessionalId(req, res) {
  try {
  const { id: professionalId, serviceid } = req.params;

    console.log(professionalId,serviceid);
    const location = await getLocationServiceByProfessionalId(professionalId,serviceid);
         if (!location) {
      return res.json({
        address_line: "",
        zipcode: "",
      });
    }
    return res.json(location);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching location",
      error: error?.message || "An unexpected error occurred",
    });
  }
}


export async function addMilesToDb(req, res) {
  try {
    console.log("Add miles request body:", req.body);
    await addMiles(req.body); // No need to capture return
    res.status(201).json({ message: "Miles added successfully" });
  } catch (error) {
    console.error("Error adding miles:", error);
    res.status(500).json({
      message: "Error adding miles",
      error: error.message
    });
  }
}



export async function getAllMilesFromDB(req,res){
try{
const miles= await getAllMiles();
   return res.json(miles);
  }catch(error){
   res.status(500).json({
      success: false,
      message: "Error fetching miles",
      error: error?.message || "An unexpected error occurred",
    });
  }
}


export async function addMinute(req,res) {
    try{
      console.log("Add miles request body:", req.body);
    await addMinutes(req.body); // No need to capture return
    res.status(201).json({ message: "Minutes added successfully" });
    }catch(error){
      res.status(500).json({
      success: false,
      message: "Error fetching miles",
      error: error?.message || "An unexpected error occurred",
    });
    }
}

export async function getAllMinutesFromDB(req,res){
try{
const miles= await getAllMinutes();
   return res.json(miles);
  }catch(error){
   res.status(500).json({
      success: false,
      message: "Error fetching minutes",
      error: error?.message || "An unexpected error occurred",
    });
  }
}





//
export async function addVehicleType(req,res) {
    try{
      console.log("Add miles request body:", req.body);
    await addVehileTypes(req.body); // No need to capture return
    res.status(201).json({ message: "Vehicle type added successfully" });
    }catch(error){
      res.status(500).json({
      success: false,
      message: "Error fetching vehicle type",
      error: error?.message || "An unexpected error occurred",
    });
    }
}

export async function getAllVehicleTypesFromDb(req,res){
try{
const miles= await getAllVehicleType();
   return res.json(miles);
  }catch(error){
   res.status(500).json({
      success: false,
      message: "Error fetching vehicle types.",
      error: error?.message || "An unexpected error occurred",
    });
  }
}


// user loacation:


export async function insertUserLocationHandler(req, res) {
  try {
    const userLocationData = { ...req.body };
    const userId  = req.params.id; // Fixed: destructure userId properly
    console.log("UserId: ", userId);
    // Validate required fields
    const { type, country, state, city, zipcode } = userLocationData;
    console.log(`${type}, ${country}, ${state}, ${city}, ${zipcode}`);
    if (!type || !country || !state || !city || !zipcode) {
      return res.status(400).json({
        success: false,
        message: "type, country, state, city, zipcode, and userId are required fields"
      });
    }

    const createdUserLocation = await insertUserLocationById(userLocationData, userId);
    
    res.status(201).json({
      success: true,
      message: "User location has been created successfully",
      data: {
        locationId: createdUserLocation.id,
        userId: userId,
        type: type,
        country: country,
        state: state,
        city: city,
        zipcode: zipcode
      }
    });
  } catch (error) {
    console.error('Error creating user location:', error);
    
    // Handle specific error types
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return res.status(409).json({
        success: false,
        message: "Location already exists for this user"
      });
    }
    
    if (error.message.includes('foreign key') || error.message.includes('user')) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating user location",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

export async function getUserLocationHandler(req, res) {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const userLocation = await getUserLocationById(userId);
    
    if (!userLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found for this user"
      });
    }

    res.status(200).json({
      success: true,
      message: "User location retrieved successfully",
      data: userLocation
    });
  } catch (error) {
    console.error('Error getting user location:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user location",
      error: error?.message || "An unexpected error occurred",
    });
  }
}

//==============================================================
// get pro count by location controller
//==============================================================

export const getProCountByLocationHandler = async (req, res) => {
  try {
    const data = await getProCountByLocation();

    res.status(200).json({
      success: true,
      count: data.length,
      locations: data
    });
  } catch (error) {
    console.error("Error fetching professional count by location:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching professional count",
      error: error.message
    });
  }
};