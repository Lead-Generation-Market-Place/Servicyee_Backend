import express from 'express'
import { getPro } from '../controllers/userController.js';

const router = express.Router()

// mounted on /api/professionals, so this will be /api/professionals
router.get('/', getPro)

export default router
