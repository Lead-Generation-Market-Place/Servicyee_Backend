import LocationModel from "../../models/LocationModel";

import servicesModel from "../../models/servicesModel"

export const getPopularServicesDefault = async () => {
    try {
        return servicesModel.find().limit(8).select();
    } catch (error) {
        throw new Error("Error: ", error);
    }
}

export const getPopularServiceByLocation = async (userLocation) => {
    try {
        return LocationModel.find({
            zipcode:userLocation,
            type:"service"
        });
    } catch (error) {
        throw new Error("Error occured: ", error);
    }
}