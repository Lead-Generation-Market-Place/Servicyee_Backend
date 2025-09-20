

import Search from '../services/search.js'; // adjust the path if needed

export const searchServiceByLocation = async (req, res, next) => {
  try {
    const { service_id, zip_code, searchText } = req.body;

    // Call the service method
    const services = await Search.searchServiceByLocation(service_id, zip_code, searchText);

    // Return the found services
    res.status(200).json({ services });
  } catch (error) {
    next(error);
  }
};
