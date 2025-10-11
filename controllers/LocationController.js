import {
  createLocation,
  deleteLocationById,
  getAllLocations,
  getLocationById,
  updateLcoation,
  GetLocationByUserId,
  getLocationServiceByProfessionalId
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

// GET Location by userId
export async function getLocationByUserIdHandler(req, res) {
  try {
    const user_id = req.user.id; // Get authenticated user id from JWT middleware
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
    await deleteLocationById(req.params.id);
    res.status(204).send();
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