import { createLocation, getAllLocations } from "../services/LocationServices.js";

export async function createLocationHandler(req, res) {
    try {
        const location = await createLocation(req.body);
        res.status(201).json(location);

    }catch (error) {
        res.status(500).json({message:"Error Creating Location", error});
    }
}

export async function getLocationHandler(req, res) {
    try {
        const locations = await getAllLocations(req, res);
        res.status(200).json({message:"location added successfull", locations});
    } catch (error) {
        res.status(500).json({message:"Unable to get location", error})
    }
}