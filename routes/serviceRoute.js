import express from "express";
import {
  getServices,
  addServices,
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
  updateServicePricing,
  GetProfessionalServices,
  updateProfessionalServiceStatus,
  CreateService,
  getServiceQuestionsByServiceId,
  SubmitAnswersServiceQuestions,
  createServiceLocationController,
  deleteSerivceById,
  updateServiceStatusHandler,
  updateFeaturedServiceHandler,
  updateServiceHandler,
  updateServiceController,
  getprofessionalServiceById,
  updateServiceLocation,
  getServiceLocationsById,
  getServicesBySubcategoryIdHandler,
} from "../controllers/serviceController.js";

import fileupload from "../config/multer.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getCategories } from "../controllers/categoryController.js";
import { getSubCategories } from "../controllers/subCategoryController.js";
import { get } from "http";
import { celebrate, Segments } from "celebrate";
import { pricingSchema } from "../validators/services/service.js";

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
  "/pricing",
  authenticateToken,
  celebrate({ [Segments.BODY]: pricingSchema }),
  addServicePricing
);
router.put(
  "/service_status",
  authenticateToken,
  updateProfessionalServiceStatus
);
router.get("/list", authenticateToken, getServices);
router.post("/create_service", authenticateToken, CreateService);
router.get("/get_service", authenticateToken, getprofessionalServiceById);
router.get("/get_servicelocation", authenticateToken, getServiceLocationsById);
router.get(
  "/service_questions/:id",
  authenticateToken,
  getServiceQuestionsByServiceId
);
router.put("/answers_submit", authenticateToken, SubmitAnswersServiceQuestions);
router.put(
  "/service_location",
  authenticateToken,
  createServiceLocationController
);
router.put("/updateservice_location", authenticateToken, updateServiceLocation);
router.delete("/delete_service", authenticateToken, deleteSerivceById);

// end of services Management Routes

router.get("/", getServices);
router.post("/", fileupload("service").single("image_url"), addServices);
router.put("/pricing", addServicePricing);

//featured services
router.get("/featured", featuredServicesHandler);

// ✅ Dynamic route must be LAST
router.get("/:id", getServiceById);
router.put("/pricing/update", updateProfessionalService);
router.put(
  "/:id",
  fileupload("service").single("image_url"),
  updateServiceController
);
router.get("/", getServices);
router.post("/", fileupload("service").single("image_url"), addServices);
router.post("/pricing", addServicePricing);
//featured services
router.get("/featured", featuredServicesHandler);

router.get("/:id", getServiceById);
router.put("/pricing/update", updateProfessionalService);

// ******************************************
//       Manage Services
// ******************************************
router.put(
  "/:id",
  fileupload("service").single("image_url"),
  updateServiceHandler
);
router.put("/:id/status", updateServiceStatusHandler);
router.put("/:id/featured", updateFeaturedServiceHandler);

// Use this pattern: /professional-service/:professionalId/:serviceId
router.put("/professional-service/update", updateProfessionalService);

router.delete("/:id", deleteService);
router.delete("/pro-service/delete/:id", deleteProService);

//getting services by subcategory id route  created by Khalid Durrani
router.get("/services-by-subcategory/:id", getServicesBySubcategoryIdHandler);

export default router;
