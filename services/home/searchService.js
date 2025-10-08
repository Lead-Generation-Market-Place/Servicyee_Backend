import professionalServicesModel from "../../models/professionalServicesModel.js";

export async function searchService(searchKey) {
    try {
        console.log(`Searching for: "${searchKey}"`); // Debug log
        
        const results = await professionalServicesModel.aggregate([
            {
                $lookup: {
                    from: 'services', // assuming your services collection name
                    localField: 'service_id',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'professionals', // assuming your professionals collection name
                    localField: 'professional_id',
                    foreignField: '_id',
                    as: 'professional'
                }
            },
            {
                $unwind: '$service'
            },
            {
                $unwind: '$professional'
            },
            {
                $match: {
                    $and: [
                        { service_status: true },
                        { service_availability: true },
                        {
                            $or: [
                                { 'service.service_name': { $regex: `^${searchKey}`, $options: 'i' } },
                                { 'service.description': { $regex: `^${searchKey}`, $options: 'i' } },
                                { 'service.category': { $regex: `^${searchKey}`, $options: 'i' } }
                            ]
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    professional_id: 1,
                    service_id: 1,
                    location_id: 1,
                    maximum_price: 1,
                    minimum_price: 1,
                    service_status: 1,
                    description: 1,
                    service_availability: 1,
                    pricing_type: 1,
                    completed_tasks: 1,
                    business_hours: 1,
                    answers: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'service.service_name': 1,
                    'service.description': 1,
                    'service.category': 1,
                    'professional.name': 1,
                    'professional.email': 1,
                    'professional.phone': 1
                }
            },
            {
                $sort: { 'service.service_name': 1 }
            }
        ]);
        
        console.log(`Found ${results.length} professional services for "${searchKey}"`); // Debug log
        return results;
        
    } catch(error) {
        console.error("Search service error: ", error);
        console.error("Error details:", error.message);
        throw new Error("Failed to search service");
    }
}
