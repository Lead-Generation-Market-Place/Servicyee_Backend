import express from "express";
import { acceptLead, createLead, getLeadById, getLeadByProfessionalId } from "../controllers/lead/leadController.js";
import fileupload from '../config/multer.js';

const router = express.Router();

router.post(
  "/generate",
  fileupload("Lead").array("files", 10), 
  createLead
);
router.put("/accept", acceptLead);
router.get("/professional-leads/:professionalId",getLeadByProfessionalId);
router.get("/:leadId", getLeadById);

export default router;