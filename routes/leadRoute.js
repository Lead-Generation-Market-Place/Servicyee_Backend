import express from "express";
import { acceptLead, createLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/generate", createLead);
router.put("/accept", acceptLead);

export default router;