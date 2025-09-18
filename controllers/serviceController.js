import servicesService from '../services/services.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await servicesService.getAllServices();
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};

export const addServices = async (req, res, next) => {
  try {
    const serviceData = req.body;
    const createdService = await servicesService.addService(serviceData);
    res.status(201).json({ data: createdService });
  } catch (error) {
    next(error);
  }
};
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await servicesService.getServiceById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ data: service });
  } catch (error) {
    next(error);
  }
};


export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await servicesService.updateService(id, updateData);

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedService = await servicesService.deleteService(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addServiceForSubCategory = async (req, res, next) => {
  try {
    
    const serviceData = req.body;
    const createdServiceData = await servicesService.addServiceForSubCategory(serviceData);
    res.status(201).json({ data: createdServiceData });
  } catch (error) {
    console.error("🔥 Error in Controller:", error);
    next(error);
  }
};

export const getServicesOFAuthenticatedUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const services = await servicesService.getServiceOFAuthenticatedUser(id);

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'Services not found for this user.' });
    }

    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};
