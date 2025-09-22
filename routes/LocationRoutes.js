import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
} from "../controllers/LocationController.js";
import { authenticateJWT } from "../middleware/auth.js";


const router = express.Router();

router.get('/all', getLocationHandler);
router.get('/pro',authenticateJWT, getLocationByUserIdHandler); // Get location by authenticated user
router.post('/create',createLocationHandler);
router.put('/:id/update', updateLocationHandler);
router.delete('/:id/delete', deleteLocationByIdHandler);

export default router;