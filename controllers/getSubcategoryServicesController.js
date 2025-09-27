import { getAllServicesBySubCategories } from "../services/servicesBySubcategoriesService.js";

export async function getServicesBySubcategoris(req, res) {
    try {
        const services = await getAllServicesBySubCategories();
        res.json(services);
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"unable to get services",
            error:error?.message || "An unexpected error occured"
        });
    }
}