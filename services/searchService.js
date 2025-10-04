import ServicesModel from "../models/servicesModel.js";

export async function searchService(searchKey) {
    try {
        console.log(`Searching for: "${searchKey}"`); // Debug log
        
        const results = await ServicesModel.find({
            $or: [
                { service_name: { $regex: searchKey, $options: 'i' } },
                { description: { $regex: searchKey, $options: 'i' } },
                { category: { $regex: searchKey, $options: 'i' } }
            ]
        }).select('-__v').sort({ service_name: 1 });
        
        console.log(`Found ${results.length} services for "${searchKey}"`); // Debug log
        return results;
        
    } catch(error) {
        console.error("Search service error: ", error);
        console.error("Error details:", error.message); // More detailed error
        throw new Error("Failed to search service");
    }
}