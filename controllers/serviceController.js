import servicesService from '../services/services.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await servicesService.getAllServices();
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};
// Add a new service (like "Home Cleaning")
export const addServices = async (req, res, next) => {
  try {
    const createdService = await servicesService.addService(req.body);
    res.status(201).json({ data: createdService });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const assignServiceToProfessional = async (req, res, next) => {
  try {

    const assignedService = await servicesService.assignServiceToProfessional(req.body);
    res.status(201).json({ data: assignedService });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Optional: get all assigned services of a professional
export const getAssignedServicesForProfessional = async (req, res, next) => {
  try {
    const professional_id = req.params.professionalId;
    const assignedServices = await servicesService.getAssignedServicesForProfessional(professional_id);
    res.status(200).json({ data: assignedServices });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await servicesService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const updatedService = await servicesService.updateService(req.params.id, req.body);
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const deletedService = await servicesService.deleteService(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getServicesOFAuthenticatedUser = async (req, res, next) => {
  try {
    const services = await servicesService.getServicesOfProfessional(req.params.id);
    if (!services || services.length === 0)
      return res.status(404).json({ message: 'No services found for this user.' });
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalCount =async (req,res,next)=>{
  try {
    const serviceLocations = await servicesService.getAllPopularServiceLocationWithProCount();
    if(!serviceLocations){
      return res.status(404).json({message:'No service locations found.'})
    }
    res.status(200).json({message:serviceLocations});
  } catch (error) {
    next(error);
  }
}

