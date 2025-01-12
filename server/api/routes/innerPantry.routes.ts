import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import {
  getPreparationTasks,
  updatePreparationStatus,
  getDeliveryPersonnel,
  updateDeliveryPersonnel,
  assignMealBox,
  updateDeliveryStatus,
  getMealBoxes,
  createMealBox,
  deleteMealBox,
} from "../controllers/innerPantry.controller";

const router = express.Router();

// Task Management Routes
router.get(
  "/preparation-tasks",
  auth,
  authorize("pantry"),
  getPreparationTasks
);
router.put(
  "/preparation-tasks/:taskId",
  auth,
  authorize("pantry"),
  updatePreparationStatus
);

// Delivery Personnel Routes
router.get(
  "/delivery-personnel",
  auth,
  authorize("pantry", "manager"),
  getDeliveryPersonnel
);
router.put(
  "/delivery-personnel/:id",
  auth,
  authorize("pantry", "manager"),
  updateDeliveryPersonnel
);

// Meal Box Management Routes
router.post("/meal-boxes", auth, authorize("pantry"), createMealBox);
router.post("/meal-boxes/assign", auth, authorize("pantry"), assignMealBox);
router.put(
  "/meal-boxes/:mealBoxId/status",
  auth,
  authorize("pantry", "delivery"),
  updateDeliveryStatus
);
router.get("/meal-boxes", auth, authorize("pantry", "manager"), getMealBoxes);
router.delete(
  "/meal-boxes/:id",
  auth,
  authorize("pantry", "manager"),
  deleteMealBox
);

export default router;
