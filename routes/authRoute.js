import express from "express";
import { login, register, getCurrentUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post('/register', register);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/login', login);

export default router;