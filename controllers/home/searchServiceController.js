import { searchService } from "../../services/home/searchService.js";

export const searchServiceHandler = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                data: []
            });
        }
        
        const searchKey = q.trim();
        
        // For suggestion feature, you might want only service names
        const services = await searchService(searchKey);
        
        // Extract unique service names for suggestions
        const serviceSuggestions = [...new Set(services.map(item => 
            item.service?.service_name || item.service_id?.service_name
        ))].filter(Boolean);
        
        res.status(200).json({
            success: true,
            data: services,
            suggestions: serviceSuggestions,
            count: services.length
        });

    } catch (error) {
        console.error('Search controller error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message || "An unexpected error occurred"
        });
    }
}

export const searchServiceByLocationHandler = async (req, res) => {
    try {
        const { searchKey, zipcode} = req.query;
        if (!searchKey || !zipcode) {
            res.status(401).json({message:"search input and zipcode are required"});
        }
        const searchInput = searchKey.trim();
        const zipCode = zipcode.trim();
        const professionals = await searchByLocationService(searchInput, zipCode);
        res.status(200).json(
            {
                success:true,
                data:professionals,
                count:professionals.length,
            });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to find professionals",
            error:error?.message || "An unexpected error occured",
        });
    }
}