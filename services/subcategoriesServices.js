
import subCategoryModel from "../models/subCategoryModel.js";


export function getSubcategoriesServices() {
    try {
        return subCategoryModel.aggregate([
            {
                $lookup:{
                    from:'services',
                    localField:'_id',
                    foreignField:'subcategory_id',
                    as: 'services'
                }
            },
            {
                $project: {
                    _id:1,
                    name:1,
                    slug:1,
                    subcategory_image_url:1,
                    services:{
                        $map:{
                            input:'$services',
                            as:'service',
                            in:{
                                _id:'$$service._id',
                                name:'$$service.name',
                                slug:'$$service.slug',
                                description:'$$service.description',
                                image_url:'$$service.image_url'
                            }
                        }
                    },
                    services_count: {$size:'$services'}
                }
            },
            {
                $sort: { name: 1}
            }
        ]);
        
    } catch(error) {
        throw new Error("Unable to fetch data: ", error);
    }
}