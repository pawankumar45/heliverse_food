"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const pantry_controller_1 = require("../controllers/pantry.controller");
const router = express_1.default.Router();
// Task management routes
router.get("/tasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.getPantryTasks);
router.put("/tasks/:id/status", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.updateTaskStatus);
// Inventory management routes
router.get("/inventory", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.getInventory);
router.post("/inventory", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.addInventoryItem);
router.put("/inventory", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.updateInventory);
router.delete("/inventory/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.deleteInventoryItem);
// Inventory analytics routes
router.get("/inventory/low-stock", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.getLowStockItems);
router.get("/inventory/expiring", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), pantry_controller_1.getExpiringItems);
exports.default = router;
