import express from "express";
import { 
    createLocationHandler,
    deleteLocationByIdHandler,
    getLocationByIdHandler,
    getLocationHandler,
    updateLocationHandler 
} from "../controllers/LocationController.js";


const router = express.Router();

router.get('/all', getLocationHandler);
router.get('/:id', getLocationByIdHandler);
router.post('/create',createLocationHandler);
router.put('/:id/update', updateLocationHandler);
router.delete('/:id/delete', deleteLocationByIdHandler);

export default router;