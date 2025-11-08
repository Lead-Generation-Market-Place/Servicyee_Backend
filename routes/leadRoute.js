import express from "express";
import { acceptLead, createLead, getLeadByProfessionalId } from "../controllers/lead/leadController.js";

const router = express.Router();

router.post("/generate", createLead);
router.put("/accept", acceptLead);
router.get("/professional-leads/:professionalId",getLeadByProfessionalId);

export default router;