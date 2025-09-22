import express from 'express';
import {
searchServiceByLocation
} from '../controllers/searchController.js';
// import { validateBody } from '../middlewares/validate.middleware.js';


const router = express.Router();



router.post('/',searchServiceByLocation);
export default router;
