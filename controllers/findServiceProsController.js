import findServicePros from "../services/findServicePros.js";

export const getProfessionalsByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const professionalServices =
      await findServicePros.getProfessionalsByService(serviceId);

    if (!professionalServices || professionalServices.length === 0) {
      return res.status(404).json({
        success: true,
        message: `No professionals found for service ID: ${serviceId}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Professionals found successfully",
      count: professionalServices.length,
      data: professionalServices,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalsDetailsByService = async (req, res, next) => {
  try {
    const pro_id = req.params.professionalId;
    console.log(pro_id);
    if (!pro_id) {
      return res.status(400).json({
        success: false,
        message: "Professional ID is required",
      });
    }
    const proDetails = await findServicePros.getProfessionalsDetailsByService(
      pro_id
    );
    if (!proDetails || proDetails.length === 0) {
      return res.status(404).json({
        success: true,
        message: `No professionals found for ID: ${professionId}`,
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Professional found successfully",
      data: proDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalsByServiceWithHighestRating = async (
  req,
  res,
  next
) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const professionalServices =
      await findServicePros.getProfessionalsByServiceHighestRating(serviceId);

    if (!professionalServices || professionalServices.length === 0) {
      return res.status(404).json({
        success: true,
        message: `No professionals found for service ID: ${serviceId}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Professionals found successfully",
      count: professionalServices.length,
      data: professionalServices,
    });
  } catch (error) {
    next(error);
  }
};

export const getProsAndCompaniesByServiceHighestRating = async (
  req,
  res,
  next
) => {
  try {
    const { serviceId, businessType } = req.params;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const professionalServices =
      await findServicePros.getProsAndCompaniesByServiceHighestRating(
        serviceId,
        {
          businessType: businessType,
          limit: 5,
        }
      );

    if (!professionalServices || professionalServices.length === 0) {
      return res.status(404).json({
        success: true,
        message: `No professionals found for service ID: ${serviceId}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Professionals found successfully",
      count: professionalServices.length,
      data: professionalServices,
    });
  } catch (error) {
    next(error);
  }
};

export const getServicesByNameZip = async (req, res, next) => {
  try {
    const { serviceId, zipCode } = req.body;

    if (!serviceId || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "Both serviceId and zipCode are required",
      });
    }

    const professionals = await findServicePros.getServicesByNameZip(serviceId, zipCode);

    if (!professionals || professionals.length === 0) {
      return res.status(404).json({
        success: true,
        message: `No professionals found for service ID: ${serviceId} and zip code ${zipCode}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Professionals found successfully",
      count: professionals.length,
      data: professionals,
    });
  } catch (error) {
    next(error);
  }
};


