import express from "express";
import { getAllusers, login, register } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllusers);

export default router;