import LicenseTypeModel from '../models/licenseTypeModel.js';

class LicenseTypeService {
  async getAllLicenseTypes() {
    try {
      return await LicenseTypeModel.find();
    } catch (error) {
      throw error;
    }
  }

  async addLicenseType(licenseTypeData) {
    try {
      const newLicenseType = new LicenseTypeModel(licenseTypeData);
      return await newLicenseType.save();
    } catch (error) {
      throw error;
    }
  }

  async getLicenseTypeById(licenseTypeId) {
    try {
      return await LicenseTypeModel.findById(licenseTypeId);
    } catch (error) {
      throw error;
    }
  }
  
  async updateLicenseType(licenseTypeId, updateData) {
    try {
      const updatedLicenseType = await LicenseTypeModel.findByIdAndUpdate(
        licenseTypeId,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedLicenseType;
    } catch (error) {
      throw error;
    }
  }

  async deleteLicenseType(licenseTypeId) {
    try {
      const deletedLicenseType = await LicenseTypeModel.findByIdAndDelete(licenseTypeId);
      return deletedLicenseType;
    } catch (error) {
      throw error;
    }
  }
}

export default new LicenseTypeService();