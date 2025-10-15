import { getSubcategoriesServices } from "../services/subcategoriesServices.js";


export async function subcategoriesServicesHandler(req, res) {
    try {
        const services = await getSubcategoriesServices();
        if(!services || services.length === 0){
            return res.status(400).json({
                success:false,
                message:"Unable to get services",
                data:[]
            });
        }
        res.status(200).json({
            success:true,
            message:"Subcategories with its services",
            data:services
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"unable to get services",
            error:error?.message || "An unexpected error occured"
        });
    }
}