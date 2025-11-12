import express from "express";
import { acceptLead, createLead, getLeadById, getLeadByProfessionalId } from "../controllers/lead/leadController.js";

const router = express.Router();

router.post("/generate", createLead);
router.put("/accept", acceptLead);
router.get("/professional-leads/:professionalId",getLeadByProfessionalId);
router.get("/:leadId", getLeadById);

export default router;