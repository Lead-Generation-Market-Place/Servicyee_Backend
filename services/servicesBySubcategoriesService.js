import servicesModel from "../models/servicesModel.js";


export function getAllServicesBySubCategories() {
    return servicesModel.find().populate('subcategory_id','name').exec();
}