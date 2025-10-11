import { getPopularServiceByLocationService, getPopularServicesDefault } from "../../services/home/popularServicesService.js";

export const getPopularServiceByLocation = async (req, res, next) => {
    try {
        const { location } = req.query; // Get location from query params
        
        // If no location provided, get default popular services
        if (!location) {
            const popularServices = await getPopularServicesDefault();
            console.log(popularServices);
            return res.status(200).json({
                success: true,
                count: popularServices?.length || 0,
                data: popularServices
            });
        }

        // If location is provided, get services for that location
        const services = await getPopularServiceByLocationService(location);

        
        if (!services || services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No services found in this location'
            });
        }

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });

    } catch (error) {
        // Pass to error handling middleware or send response
        if (next) {
            next(error);
        } else {
            res.status(500).json({
                success: false,
                message: "Unable to get popular services",
                error: error?.message || "An unexpected error occurred",
            });
        }
    }
};