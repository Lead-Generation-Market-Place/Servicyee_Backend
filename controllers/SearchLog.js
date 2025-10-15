import { searchProfessionalsService } from "../services/SearchLog.js";

export async function searchProfessionalsController(req, res) {
  try {
    const { serviceName, zipcode } = req.query;

    if (!serviceName || !zipcode) {
      return res.status(400).json({ message: "serviceName and zipcode are required" });
    }

    const professional_services = await searchProfessionalsService(serviceName, zipcode);

    return res.json({
      query: { serviceName, zipcode },
      total: professional_services.length,
      professional_services,
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
