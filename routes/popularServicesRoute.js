import express from "express";
import { getPopularServiceByLocation } from "../controllers/home/popularServicesController.js";

const router = express.Router();

router.get("/", getPopularServiceByLocation);

export default router;