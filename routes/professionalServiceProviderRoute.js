import express from 'express';
import { fetchTopProfessionals } from '../controllers/home/professionalServiceProviderController.js';
const router = express.Router();



router.get("/", fetchTopProfessionals);

export default router;