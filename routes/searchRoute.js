import express from 'express';
import {
searchServiceByLocation,
getAllPopularSearchByUserLocation
} from '../controllers/searchController.js';
import { searchServiceHandler } from '../controllers/searchServiceController.js';
// import { validateBody } from '../middlewares/validate.middleware.js';


const router = express.Router();



// router.post('/',searchServiceByLocation);
router.post('/popular-search',getAllPopularSearchByUserLocation);
router.get('/', searchServiceHandler);

export default router;
