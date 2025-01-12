"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const delivery_controller_1 = require("../controllers/delivery.controller");
const delivery_controller_2 = require("../controllers/delivery.controller");
const router = express_1.default.Router();
router.get("/tasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), delivery_controller_2.getDeliveryTasks);
router.get("/deliveryTasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), delivery_controller_1.getAllDeliveryTasks);
router.get("/mealTasks", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), delivery_controller_1.getAllMealTasks);
// router.put(
//   "/tasks/:id/status",
//   auth,
//   authorize("delivery"),
//   updateDeliveryStatus
// );
// router.get(
//   "/history",
//   auth,
//   authorize("delivery", "manager"),
//   getDeliveryHistory
// );
router.post("/confirm/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), delivery_controller_2.confirmDelivery);
router.get("/assigned", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), delivery_controller_1.getAssignedDeliveries);
router.put("/:id/status", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), delivery_controller_2.updateDeliveryStatus);
router.put("/availability", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery"), delivery_controller_1.updateAvailabilityStatus);
router.get("/history", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("delivery", "manager"), delivery_controller_2.getDeliveryHistory);
exports.default = router;
