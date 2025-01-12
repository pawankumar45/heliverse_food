import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import {
  // Manager Analytics
  getDeliveryStats,
  getPatientStats,
  getMealDistribution,
  getDietaryRestrictions,
  getWeeklyMealPreparation,

  // Pantry Analytics
  getInventoryLevels,
  getMealPreparationTrend,
  getIngredientUsage,
  getTaskCompletionRate,

  // Delivery Analytics
  getPersonalDeliveryStats,
  getCurrentDeliveries,
  getDeliveryHistory,
  getPerformanceMetrics,
} from "../controllers/analytics.controller";

const router = express.Router();

// Manager Dashboard Routes
router.get(
  "/manager/delivery-stats",
  auth,
  authorize("manager"),
  getDeliveryStats
);
router.get(
  "/manager/patient-stats",
  auth,
  authorize("manager"),
  getPatientStats
);
router.get(
  "/manager/meal-distribution",
  auth,
  authorize("manager"),
  getMealDistribution
);
router.get(
  "/manager/dietary-restrictions",
  auth,
  authorize("manager"),
  getDietaryRestrictions
);
router.get(
  "/manager/weekly-meal-preparation",
  auth,
  authorize("manager"),
  getWeeklyMealPreparation
);

// Pantry Dashboard Routes
router.get(
  "/pantry/inventory-levels",
  auth,
  authorize("pantry"),
  getInventoryLevels
);
router.get(
  "/pantry/meal-preparation-trend",
  auth,
  authorize("pantry"),
  getMealPreparationTrend
);
router.get(
  "/pantry/ingredient-usage",
  auth,
  authorize("pantry"),
  getIngredientUsage
);
router.get(
  "/pantry/task-completion-rate",
  auth,
  authorize("pantry"),
  getTaskCompletionRate
);

// Delivery Dashboard Routes
router.get(
  "/delivery/stats",
  auth,
  authorize("delivery"),
  getPersonalDeliveryStats
);
router.get(
  "/delivery/current",
  auth,
  authorize("delivery"),
  getCurrentDeliveries
);
router.get(
  "/delivery/history",
  auth,
  authorize("delivery"),
  getDeliveryHistory
);
router.get(
  "/delivery/performance",
  auth,
  authorize("delivery"),
  getPerformanceMetrics
);
export default router;
