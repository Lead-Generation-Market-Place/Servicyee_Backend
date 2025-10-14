import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
    ,addMilesToDb,
    getServiceLocationByProfessionalId,getAllMilesFromDB,addMinute
} from "../controllers/LocationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authenticateToken, getLocationHandler);
router.get('/pro',authenticateToken, getLocationByUserIdHandler);
router.get('/miles',authenticateToken,getAllMilesFromDB)
router.get('/pro/:id/:serviceid',authenticateToken,getServiceLocationByProfessionalId);
router.post('/create', createLocationHandler);
router.post('/minute',addMinute);
router.post('/miles',addMilesToDb);
router.put('/:id/update',authenticateToken, updateLocationHandler);
router.delete('/delete/:id' ,authenticateToken, deleteLocationByIdHandler);

export default router;