import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationByUserIdHandler,
    getLocationHandler,
    updateLocationHandler 
    ,addMilesToDb,
    getServiceLocationByProfessionalId,getAllMilesFromDB,addMinute,getAllMinutesFromDB,addVehicleType,getAllVehicleTypesFromDb
} from "../controllers/LocationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get('/all',authenticateToken, getLocationHandler);
router.get('/pro',authenticateToken, getLocationByUserIdHandler);
router.get('/miles',authenticateToken,getAllMilesFromDB)
router.get('/minute',authenticateToken,getAllMinutesFromDB);
router.get('/vehicle_type',authenticateToken,getAllVehicleTypesFromDb)
router.get('/pro/:id/:serviceid',authenticateToken,getServiceLocationByProfessionalId);
router.post('/create', authenticateToken,createLocationHandler);
router.post('/minute',authenticateToken,addMinute);
router.post('/miles',authenticateToken,addMilesToDb);
router.post('/vehicle_type',authenticateToken,addVehicleType);
router.put('/:id/update',authenticateToken, updateLocationHandler);
router.delete('/delete/:id' ,authenticateToken, deleteLocationByIdHandler);

export default router;