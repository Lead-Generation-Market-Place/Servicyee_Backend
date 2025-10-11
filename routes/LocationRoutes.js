import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
    ,
    getServiceLocationByProfessionalId
} from "../controllers/LocationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authenticateToken, getLocationHandler);
router.get('/pro',authenticateToken, getLocationByUserIdHandler); // Get location by authenticated user
router.get('/pro/:id/:serviceid',authenticateToken,getServiceLocationByProfessionalId);
router.post('/create', createLocationHandler);
router.put('/:id/update',authenticateToken, updateLocationHandler);
router.delete('/:id/delete' ,authenticateToken, deleteLocationByIdHandler);

export default router;