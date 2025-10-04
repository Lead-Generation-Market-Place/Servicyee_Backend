import express from "express";
import {authenticateToken} from "../middleware/authMiddleware.js";
import { getAllusers, login, register } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all',authenticateToken, getAllusers);

export default router;