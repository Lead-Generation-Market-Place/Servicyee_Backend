import express from "express";
import {getServicesBySubcategoris} from "../controllers/getSubcategoryServicesController.js";

const router = express();

router.get('/all/servies', getServicesBySubcategoris);

export default router;