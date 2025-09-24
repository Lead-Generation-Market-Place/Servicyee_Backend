//import Professional from "../models/ProfessionalModel.js";
import professionalServices from "../models/professionalServicesModel.js";
import services from "../models/servicesModel.js";
class findServicePros {
  async getProfessionalsByService(serviceId) {
    try {
      const pros = await professionalServices
        .find({
          service_id: serviceId,
        })
        
        .populate({
          path: "professional_id",
          select: "business_name introduction business_type profile_image",
          populate: {
            path: "user_id",
            select: "username email",
          },
        }).populate({
            path:"service_id",
            select:"service_name service_status",
            model:services
        })
        .populate({
          path: "location_id",
          select: "country state"
        })
        .limit(10)
        .exec();
      return pros;
    } catch (error) {
      throw error;
    }
  }
}

export default new findServicePros();
