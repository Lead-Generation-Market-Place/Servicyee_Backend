import express from "express";
import { subcategoriesServicesHandler } from "../controllers/subcategoriesServicesController.js";


const router = express();

router.get('/', subcategoriesServicesHandler);

export default router;