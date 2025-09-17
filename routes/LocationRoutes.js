import express from "express";
import { createLocationHandler,getLocationHandler } from "../controllers/LocationController.js";


const router = express.Router();

router.get('/all', getLocationHandler)
router.post('/create',createLocationHandler);

export default router;