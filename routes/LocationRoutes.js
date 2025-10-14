import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
    ,addMilesToDb,
    getServiceLocationByProfessionalId,getAllMilesFromDB
} from "../controllers/LocationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authenticateToken, getLocationHandler);
router.get('/pro',authenticateToken, getLocationByUserIdHandler);
router.get('/miles',authenticateToken,getAllMilesFromDB)
router.get('/pro/:id/:serviceid',authenticateToken,getServiceLocationByProfessionalId);
router.post('/create', createLocationHandler);
router.post('/miles',addMilesToDb);
router.put('/:id/update',authenticateToken, updateLocationHandler);
router.delete('/:id/delete' ,authenticateToken, deleteLocationByIdHandler);

export default router;