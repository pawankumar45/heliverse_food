"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const innerPantry_controller_1 = require("../controllers/innerPantry.controller");
const router = express_1.default.Router();
// Task Management Routes
router.get("/preparation-tasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), innerPantry_controller_1.getPreparationTasks);
router.put("/preparation-tasks/:taskId", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), innerPantry_controller_1.updatePreparationStatus);
// Delivery Personnel Routes
router.get("/delivery-personnel", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), innerPantry_controller_1.getDeliveryPersonnel);
router.put("/delivery-personnel/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), innerPantry_controller_1.updateDeliveryPersonnel);
// Meal Box Management Routes
router.post("/meal-boxes", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), innerPantry_controller_1.createMealBox);
router.post("/meal-boxes/assign", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), innerPantry_controller_1.assignMealBox);
router.put("/meal-boxes/:mealBoxId/status", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "delivery"), innerPantry_controller_1.updateDeliveryStatus);
router.get("/meal-boxes", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), innerPantry_controller_1.getMealBoxes);
router.delete("/meal-boxes/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), innerPantry_controller_1.deleteMealBox);
exports.default = router;
