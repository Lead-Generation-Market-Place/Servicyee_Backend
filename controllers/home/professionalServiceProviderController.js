import { getTopProfessionalsByServiceAndZip } from "../../services/home/professionalServiceProvider.js";

export const fetchTopProfessionals = async (req, res) => {
  try {
    const { service, zipcode } = req.query;

    if (!service || !zipcode) {
      return res.status(400).json({ error: "service_id and zipcode are required" });
    }

    const professionals = await getTopProfessionalsByServiceAndZip(service, zipcode);

    if (professionals.length === 0) {
      return res.status(404).json({ message: "No professionals found for this service and zipcode" });
    }

    return res.status(200).json(professionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
