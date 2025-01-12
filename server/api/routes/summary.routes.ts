import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import {
  getPreparationTasksSummary,
  getMealBoxesSummary,
  getDeliveryPersonnelSummary,
  getSystemSummary,
} from "../controllers/summary.controller";

const router = express.Router();

// Summary endpoints
router.get(
  "/preparation-tasks",
  auth,
  authorize("pantry", "manager"),
  getPreparationTasksSummary
);
router.get(
  "/meal-boxes",
  auth,
  authorize("pantry", "manager"),
  getMealBoxesSummary
);
router.get(
  "/delivery-personnel",
  auth,
  authorize("pantry", "manager"),
  getDeliveryPersonnelSummary
);
router.get("/system", auth, authorize("manager"), getSystemSummary);

export default router;
