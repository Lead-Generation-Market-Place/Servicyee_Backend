import LocationModel from "../../models/LocationModel";

export const featuredServicesHandler = async (req, res) => {
    try {
        let featuredServices;
        // if user exists
        const userId = req.user?.id;
        if (userId) {
            const userLocation = LocationModel.find({user_id:userId}).select('zipcode').exec();
                   
        }
    } catch (error) {}
}