"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const summary_controller_1 = require("../controllers/summary.controller");
const router = express_1.default.Router();
// Summary endpoints
router.get("/preparation-tasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), summary_controller_1.getPreparationTasksSummary);
router.get("/meal-boxes", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), summary_controller_1.getMealBoxesSummary);
router.get("/delivery-personnel", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("pantry", "manager"), summary_controller_1.getDeliveryPersonnelSummary);
router.get("/system", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), summary_controller_1.getSystemSummary);
exports.default = router;
