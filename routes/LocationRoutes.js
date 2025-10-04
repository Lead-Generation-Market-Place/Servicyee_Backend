import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
} from "../controllers/LocationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authMiddleware, getLocationHandler);
router.get('/pro',authMiddleware, getLocationByUserIdHandler); // Get location by authenticated user
router.post('/create',authMiddleware, createLocationHandler);
router.put('/:id/update',authMiddleware, updateLocationHandler);
router.delete('/:id/delete' ,authMiddleware, deleteLocationByIdHandler);

export default router;