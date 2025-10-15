import express from 'express';
import {
searchServiceByLocation,
getAllPopularSearchByUserLocation
} from '../controllers/home/searchController.js';
import { searchServiceHandler } from '../controllers/home/searchServiceController.js';

const router = express.Router();



// router.post('/',searchServiceByLocation);
router.post('/popular-search',getAllPopularSearchByUserLocation);
router.get('/', searchServiceHandler);

export default router;
