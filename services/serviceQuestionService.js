import questionModel from "../models/questionModel.js";


export function serviceQuestions(serviceId) {
    return questionModel.find({service_id: serviceId}).exec();
}