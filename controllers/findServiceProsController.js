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

    //Formating Response for better understanding
    const formattedData = professionalServices.map((ps) => {
      return {
        serviceListing: {
          id: ps._id,
          description: ps.description,
          availability: ps.service_availability,
          status: ps.service_status,
        },

        // Professional Information
        professional: {
          id: ps.professional_id?._id,
          businessName: ps.professional_id?.business_name,
          businessType: ps.professional_id?.business_type,
          profileImage: ps.professional_id?.profile_image,
        },

        // User Information (from Professional)
        user: {
          id: ps.professional_id?.user_id?._id,
          username: ps.professional_id?.user_id?.username,
          email: ps.professional_id?.user_id?.email,
        },

        // Service Information
        service: {
          id: ps.service_id,
        },

        // Location Information
        location: {
          id: ps.location_id?._id,
          address: ps.location_id?.address_line,
          city: ps.location_id?.city,
          state: ps.location_id?.state,
          country: ps.location_id?.country,
          zipcode: ps.location_id?.zipcode,
          coordinates: ps.location_id?.coordinates,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Professionals found successfully",
      count: formattedData.length,
      data: formattedData,
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
