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
// Add a new service 
export const addServices = async (req, res, next) => {
  try {
    
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    
    const serviceData = {
      ...req.body,
      is_active:req.body.is_active === 'true' || req.body.is_active === true
    };
 
    const requiredFields = ['name', 'slug','subcategory_id'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!req.file) {
      return res.status(400).json({message: 'Service image is required.' });
    }

    serviceData.image_url = req.file.filename;
   
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
    const serviceId = req.params.id;
    const updatedServiceData = { ...req.body };

    // Check if service exists
    const existingService = await servicesService.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Handle file upload
    if (req.file) {
      // Delete old image if exists
      if (existingService.image_url) {
        const oldImagePath = path.join('uploads/service', existingService.image_url);
        
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error('✗ Error deleting old image:', err.message);
          
        }
      }
      
      // Add new image to update data
      updatedServiceData.image_url = req.file.filename;
      console.log('✓ New image set:', updatedServiceData.image_url);
    }

    // Update service
    const updatedService = await servicesService.updateService(serviceId, updatedServiceData);
    
    res.status(200).json({ 
      success: true,
      message: 'Service updated successfully',
      data: updatedService 
    });
    
  } catch (error) {
    console.error('Error in updateService controller:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    // Handle cast errors (invalid ID)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }
    
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const deletedService = await servicesService.deleteService(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    if (deletedService.image_url) {
      const imagePath = path.join('uploads/service', deletedService.image_url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete service image:', err);
        }
      });
    }
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
