import express from "express";
import {
  getPromotionsController,
  addPromotionController,
} from "../controllers/promotionController.js";

const router = express.Router();

router.get("/", getPromotionsController);
router.post("/",addPromotionController);
export default router;
