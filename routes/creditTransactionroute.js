import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { purchaseCreditsController } from "../controllers/CreditTransactionController.js";

const router = express.Router();
router.put("/purchase", authenticateToken, purchaseCreditsController);

export default router;
