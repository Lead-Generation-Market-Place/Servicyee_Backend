// controllers/professionalController.js
import { searchProfessionals } from "../services/SearchLog.js";

export async function searchProfessionalsController(req, res) {
  try {
    const { zipCode, serviceName, limit = 20, skip = 0 } = req.query;

    if (!zipCode || !serviceName) {
      return res.status(400).json({ message: "zipCode and serviceName are required." });
    }

    const results = await searchProfessionals(zipCode, serviceName, Number(limit), Number(skip));

    if (results.length === 0) {
      return res.status(404).json({ message: "No professionals found for the given criteria." });
    }

    res.status(200).json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error searching professionals:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching professionals.",
      error: error.message,
    });
  }
}
