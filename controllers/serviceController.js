import servicesService from '../services/servicesService.js';

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
