"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = express_1.default.Router();
// Manager Dashboard Routes
router.get("/manager/delivery-stats", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), analytics_controller_1.getDeliveryStats);
router.get("/manager/patient-stats", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), analytics_controller_1.getPatientStats);
router.get("/manager/meal-distribution", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), analytics_controller_1.getMealDistribution);
router.get("/manager/dietary-restrictions", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), analytics_controller_1.getDietaryRestrictions);
router.get("/manager/weekly-meal-preparation", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), analytics_controller_1.getWeeklyMealPreparation);
// Pantry Dashboard Routes
router.get("/pantry/inventory-levels", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), analytics_controller_1.getInventoryLevels);
router.get("/pantry/meal-preparation-trend", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), analytics_controller_1.getMealPreparationTrend);
router.get("/pantry/ingredient-usage", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), analytics_controller_1.getIngredientUsage);
router.get("/pantry/task-completion-rate", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry"), analytics_controller_1.getTaskCompletionRate);
// Delivery Dashboard Routes
router.get("/delivery/stats", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), analytics_controller_1.getPersonalDeliveryStats);
router.get("/delivery/current", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), analytics_controller_1.getCurrentDeliveries);
router.get("/delivery/history", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), analytics_controller_1.getDeliveryHistory);
router.get("/delivery/performance", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), analytics_controller_1.getPerformanceMetrics);
exports.default = router;
