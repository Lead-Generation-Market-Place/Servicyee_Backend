import express from "express";
import {
  getServices,
  addServices,
  updateService,
  deleteService,
  getServiceById,
  getServicesOFAuthenticatedUser,
  assignServiceToProfessional,
  getProfessionalCount,
  toggleServiceStatus,
  featuredServicesHandler,
  fetchAllServicesOfAProfessional,
  updateProfessionalService,
  deleteProService,
  addServicePricing,
  GetProfessionalServices,
  updateProfessionalServiceStatus,
  CreateService,
  getServiceQuestionsByServiceId,
  SubmitAnswersServiceQuestions,
  createServiceLocationController,
} from "../controllers/serviceController.js";

import fileupload from "../config/multer.js";
import { uploadFile } from "../controllers/ProfessionalController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getCategories } from "../controllers/categoryController.js";
import { getSubCategories } from "../controllers/subCategoryController.js";

const router = express.Router();

// ✅ Static/specific routes first
router.get("/location", getProfessionalCount); // Needs to come before /:id
router.put("/toggle-service-status", toggleServiceStatus);
router.get("/auth/:id", getServicesOFAuthenticatedUser);
router.get("/pro/:id", fetchAllServicesOfAProfessional);
router.post("/asp", assignServiceToProfessional);

// services Management Routes
router.get("/services-management", authenticateToken, GetProfessionalServices);
router.put(
  "/service_status",
  authenticateToken,
  updateProfessionalServiceStatus
);
router.get("/list", authenticateToken, getServices);
router.post("/create_service", authenticateToken, CreateService);
router.put("/pricing", authenticateToken, addServicePricing);
router.get(
  "/service_questions/:id",
  authenticateToken,
  getServiceQuestionsByServiceId
);
router.put("/answers_submit", authenticateToken, SubmitAnswersServiceQuestions);
router.put("/service_location", authenticateToken, createServiceLocationController);

// end of services Management Routes

router.get("/", getServices);
router.post("/", fileupload("service").single("image_url"), addServices);
router.put("/pricing", addServicePricing);

//featured services
router.get("/featured", featuredServicesHandler);

// ✅ Dynamic route must be LAST
router.get("/:id", getServiceById);
router.put("/pricing/update", updateProfessionalService);
router.put("/:id", fileupload("service").single("image_url"), updateService);
// Use this pattern: /professional-service/:professionalId/:serviceId
router.put("/professional-service/update", updateProfessionalService);

router.delete("/:id", deleteService);
router.delete("/pro-service/delete/:id", deleteProService);

export default router;
