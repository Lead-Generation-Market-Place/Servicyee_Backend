export const getPopularServiceByLocation = async (req, res) => {
    try {
        const userLocation = req.query;
        if (!userLocation) {
            const popularServices = await getPopularServicesDefault();
            res.status(200).json({
                success:true,
                data:popularServices
            });
        } else {
            const popularServices = await getPopularServiceByLocationService(userLocation);
            res.status(200).json({
            success:true,
            data:popularServices
        });
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to get popular services",
            error:error?.message || "An unexpected error occured",
        });
    }
}