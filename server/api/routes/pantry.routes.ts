import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import {
  getPantryTasks,
  updateTaskStatus,
  getInventory,
  updateInventory,
  addInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  getExpiringItems,
} from "../controllers/pantry.controller";

const router = express.Router();

// Task management routes
router.get("/tasks", auth, authorize("pantry", "manager"), getPantryTasks);
router.put(
  "/tasks/:id/status",
  auth,
  authorize("pantry", "manager"),
  updateTaskStatus
);

// Inventory management routes
router.get("/inventory", auth, authorize("pantry", "manager"), getInventory);
router.post(
  "/inventory",
  auth,
  authorize("pantry", "manager"),
  addInventoryItem
);
router.put("/inventory", auth, authorize("pantry", "manager"), updateInventory);
router.delete(
  "/inventory/:id",
  auth,
  authorize("pantry", "manager"),
  deleteInventoryItem
);

// Inventory analytics routes
router.get(
  "/inventory/low-stock",
  auth,
  authorize("pantry", "manager"),
  getLowStockItems
);
router.get(
  "/inventory/expiring",
  auth,
  authorize("pantry", "manager"),
  getExpiringItems
);

export default router;
