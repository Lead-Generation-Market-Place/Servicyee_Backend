import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
} from "../controllers/LocationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authenticateToken, getLocationHandler);
router.get('/pro',authenticateToken, getLocationByUserIdHandler); // Get location by authenticated user
router.post('/create',authenticateToken, createLocationHandler);
router.put('/:id/update',authenticateToken, updateLocationHandler);
router.delete('/:id/delete' ,authenticateToken, deleteLocationByIdHandler);

export default router;