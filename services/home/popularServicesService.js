
import professionalServicesModel from "../../models/professionalServicesModel.js";

import servicesModel from "../../models/servicesModel.js"

export const getPopularServicesDefault = async () => {
    try {
        return servicesModel.find({is_active:true}).limit(8).select();
    } catch (error) {
        throw new Error("Error: ", error);
    }
}

export const getPopularServiceByLocationService = async (userLocation) => {
    try {
        const services = await professionalServicesModel.aggregate([
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location_ids',
                    foreignField: '_id',
                    as: 'location_details'
                }
            },
            {
                $match: {
                    'location_details.zipcode': userLocation
                }
            },
            // Join with ServiceModel using the service_id reference
            {
                $lookup: {
                    from: 'services', // ServiceModel collection name
                    localField: 'service_id', // field in professionalServicesModel
                    foreignField: '_id', // field in ServiceModel (assuming it references _id)
                    as: 'service_info'
                }
            },
            {
                $unwind: '$service_info'
            },
            {
                $project: {
                    service_id: '$service_info._id',
                    service_name: '$service_info.name', // from ServiceModel
                    name: '$service_info.name',
                    slug: '$service_info.slug',
                    id: '$service_info._id',
                    image_url: '$service_info.image_url',
                    _id: 0
                }
            },
            {
                $group: {
                    _id: '$service_id', // Group by service_id to remove duplicates
                    service_name: { $first: '$service_name' },
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    id: { $first: '$id' },
                    image_url: { $first: '$image_url' }
                }
            },
            {
                $project: {
                    service_id: '$_id',
                    service_name: 1,
                    name: 1,
                    slug: 1,
                    id: 1,
                    image_url: 1,
                    _id: 0
                }
            },
            {
                $sort: { service_name: 1 }
            }
        ]);
        
        return services;
    } catch (error) {
        throw new Error(`Error fetching services: ${error.message}`);
    }
}