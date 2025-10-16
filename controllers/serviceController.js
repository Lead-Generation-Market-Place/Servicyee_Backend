import servicesService from '../services/services.js';
import path from 'path';
import fs from 'fs';

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
    const serviceData = req.body;
   
    if (req.file) {
      serviceData.image_url = req.file.filename;
    } else {
      return res.status(400).json({ message: 'Service image is required.' });
    }
    const createdService = await servicesService.addService(serviceData);
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
    const updatedServiceDaata = req.body;
    const serviceId = req.params.id;
    const existingService = await servicesService.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (req.file) {
      if (existingService.image_url) {
        const oldImagePath = path.join('uploads/service', existingService.image_url);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      updatedServiceDaata.image_url = req.file.filename;
    }
    const updatedService = await servicesService.updateService(serviceId, updatedServiceDaata);
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
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serviceId, status } = req.body;
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Status must be a boolean value.' });
    }
    const updatedService = await servicesService.activeInactiveServiceToggle(serviceId, status);
    res.status(200).json({ data: updatedService });
  } catch (error) {
    next(error);
  }
};


// featured services
export const featuredServicesHandler = async (req, res) => {
    try {
        const featuredServices = await servicesService.getFeaturedServices();
        
        if (!featuredServices || featuredServices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No featured services found"
            });
        }

        res.status(200).json({
            success: true,
            data: featuredServices
        });
    } catch (error) {
        console.error("Error fetching featured services:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}