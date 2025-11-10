import servicesService, { getProfessionalServices } from '../services/services.js';
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
  try {  console.log('Received data:', req.body);
    const assignedService = await servicesService.assignServiceToProfessional(req.body);

    return res.status(201).json({
      assignedService 
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to assign service."
    });
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



export const fetchAllServicesOfAProfessional = async (req, res) => {
  try {
    const professionalId = req.params.id;

    const services = await servicesService.getServicesAndSubcategoriesByProfessional(professionalId);

    res.status(200).json({
      success: true,
      data: services,
    });

  } catch (error) {
    console.error('Error fetching services of professional:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


export const updateProfessionalService = async (req, res, next) => {
  try {
    const { _id: proServiceId, serviceId, ...updateData } = req.body;

    if (!proServiceId || !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'proServiceId (_id) and serviceId are required in the request body',
      });
    }

    const updatedService = await servicesService.updateProfessionalServiceByProAndService(
      proServiceId,
      serviceId,
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    console.error('Error updating professional service:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update professional service',
    });
  }
};


export const deleteProService = async (req, res) => {
  try {
    const proServiceId = req.params.id; 

    const result = await servicesService.deleteProfessionalService(proServiceId);

    res.status(200).json({
      success: true,
      message: "Professional service deleted successfully",
      data: result,
    });
  } catch (error) {
    // Differentiate between 400 and 500 errors if needed
    const statusCode = error.message.includes("not found") || error.message.includes("Valid")
      ? 400
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete professional service",
    });
  }
};


export const addServicePricing = async (req, res) => {
  try {
    const { professional_id, service_id, ...pricingData } = req.body;

    if (!professional_id || !service_id) {
      return res.status(400).json({ message: "professional_id and service_id are required" });
    }

    const updatedPricing = await servicesService.addServicePricing(
      professional_id,
      service_id,
      pricingData
    );

    res.status(200).json({
      message: "Service pricing updated successfully",
      data: updatedPricing,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateServicePricing = async (req, res) => {
  try {
    const { professional_id, service_id, ...updateData } = req.body;

    if (!professional_id || !service_id) {
      return res.status(400).json({ message: "professional_id and service_id are required" });
    }

    const updatedPricing = await servicesService.updateServicePricing(
      professional_id,
      service_id,
      updateData
    );

    res.status(200).json({
      message: "Service pricing updated successfully",
      data: updatedPricing,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// get Professional Services of Active User 

export async function GetProfessionalServices(req, res)
{
 try {
    const userId = req.user?._id || req.user?.id || req.params.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const services = await getProfessionalServices(userId);
    if (!services) {
      return res.status(404).json({
        success: false,
        message: "Professional services not found for this user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Professional services retrieved successfully",
      services: services,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching professional services",
      error: error?.message || "An unexpected error occurred",
    });
  }
}