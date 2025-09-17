import ServiceModel from "../models/servicesModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
class ServicesService {
  async getAllServices() {
    try {
      return await ServiceModel.find({});
    } catch (error) {
      throw error;
    }
  }

  async addService(serviceData) {
    try {
      const newService = new ServiceModel(serviceData);
      return await newService.save();
    } catch (error) {
      throw error;
    }
  }

  async getServiceById(serviceId) {
    try {
      return await ServiceModel.findById(serviceId);
    } catch (error) {
      throw error;
    }
  }

  async updateService(serviceId, updateData) {
    try {
      const updatedService = await ServiceModel.findByIdAndUpdate(
        serviceId,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedService;
    } catch (error) {
      throw error;
    }
  }

  async deleteService(serviceId) {
    try {
      const deletedService = await ServiceModel.findByIdAndDelete(serviceId);
      return deletedService;
    } catch (error) {
      throw error;
    }
  }

  async addServiceForSubCategory(serviceData) {
    try {
      const serviceExists = await subCategoryModel.findById(
        serviceData.subCategory
      );

      if (!serviceExists) {
        throw new Error("SubCategory not found");
      }

      const newService = new ServiceModel(serviceData);
      return await newService.save();
    } catch (error) {
      throw error;
    }
  }

async getServicesOfProfessional(professionalId) {
  try {
    return await ServiceModel.find({ professional: professionalId });
  } catch (error) {
    throw error;
  }
}



}

export default new ServicesService();
