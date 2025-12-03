import express from "express";
import {
  login,
  register,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { loginJoiSchema } from "../validators/auth/login.js";
import { celebrate, Segments } from "celebrate";
const router = express.Router();
router.post("/register", register);
router.get("/me", authenticateToken, getCurrentUser);
router.post("/login", celebrate({ [Segments.BODY]: loginJoiSchema }), login);

export default router;
