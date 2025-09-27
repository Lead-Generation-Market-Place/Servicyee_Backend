import express from 'express';
import {
searchServiceByLocation,
getAllPopularSearchByUserLocation
} from '../controllers/searchController.js';
// import { validateBody } from '../middlewares/validate.middleware.js';


const router = express.Router();



router.post('/',searchServiceByLocation);
router.post('/popular-search',getAllPopularSearchByUserLocation)

export default router;
