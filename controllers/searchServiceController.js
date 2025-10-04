import { searchService } from "../services/searchService.js";

export const searchServiceHandler = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q ||q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                data:[]
            });
        }
        const searchKey = q.trim();

        const services = await searchService(searchKey);
        res.status(200).json({
            success:true,
            data: services,
            count:services.length
        });

    } catch (error) {
        console.error('seach controller error: ', error);
        res.status(500).json({
            success: false,
            message:"Internal server error",
            error:error?.message || "An unexpected error occured"
        });
    }
}