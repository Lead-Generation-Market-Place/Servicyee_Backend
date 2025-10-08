

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


export const getAllPopularSearchByUserLocation = async (req, res, next) => {
  try {
    const { zip_code } = req.body;
    
    if (!zip_code) {
      return res.status(400).json({ message: "zip_code is required" });
    }

    const popularSearch = await search.getAllPopularSearchByUserLocation(zip_code);

    if (!popularSearch || popularSearch.length === 0) {
      return res.status(200).json({ message: "No popular search found in this location." });
    }

    res.status(200).json({ popularSearch });
  } catch (error) {
    next(error);
  }
};

