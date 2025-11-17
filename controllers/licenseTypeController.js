import licenseTypeService from '../services/licenseTypeService.js';

export const getLicenseTypes = async (req, res, next) => {
  try {
    const licenseTypes = await licenseTypeService.getAllLicenseTypes();
    res.status(200).json({ data: licenseTypes });
  } catch (error) {
    next(error);
  }
};

export const addLicenseType = async (req, res, next) => {
  try {
    const licenseTypeData = { ...req.body };
    const { name } = licenseTypeData;
    // Validate required field
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is a required field.'
      });
    }

    const createdLicenseType = await licenseTypeService.addLicenseType(licenseTypeData);
    res.status(201).json({
      message: 'License type created successfully',
      data: createdLicenseType
    });
  } catch (error) {
    next(error);
  }
};

export const getLicenseTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const licenseType = await licenseTypeService.getLicenseTypeById(id);

    if (!licenseType) {
      return res.status(404).json({ message: 'License type not found' });
    }

    res.status(200).json({ data: licenseType });
  } catch (error) {
    next(error);
  }
};

export const updateLicenseType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Find existing license type first
    const existingLicenseType = await licenseTypeService.getLicenseTypeById(id);
    if (!existingLicenseType) {
      return res.status(404).json({ message: 'License type not found' });
    }

    // Validate name if provided
    const { name } = updateData;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    const updatedLicenseType = await licenseTypeService.updateLicenseType(id, updateData);

    if (!updatedLicenseType) {
      return res.status(404).json({ message: 'License type not found during update' });
    }

    res.status(200).json({
      message: 'License type updated successfully',
      data: updatedLicenseType
    });

  } catch (error) {
    next(error);
  }
};

export const deleteLicenseType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const licenseType = await licenseTypeService.getLicenseTypeById(id);

    if (!licenseType) {
      return res.status(404).json({ message: 'License type not found' });
    }

    await licenseTypeService.deleteLicenseType(id);

    res.status(200).json({ message: 'License type deleted successfully' });
  } catch (error) {
    next(error);
  }
};