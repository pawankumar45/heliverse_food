import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import {
  getAllDeliveryTasks,
  getAllMealTasks,
  getAssignedDeliveries,
  updateAvailabilityStatus,
} from "../controllers/delivery.controller";
import {
  getDeliveryTasks,
  updateDeliveryStatus,
  getDeliveryHistory,
  confirmDelivery,
} from "../controllers/delivery.controller";

const router = express.Router();

router.get("/tasks", auth, authorize("delivery"), getDeliveryTasks);
router.get("/deliveryTasks", auth, authorize("manager"), getAllDeliveryTasks);
router.get("/mealTasks", auth, authorize("manager"), getAllMealTasks);
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
router.post("/confirm/:id", auth, authorize("delivery"), confirmDelivery);

router.get("/assigned", auth, authorize("delivery"), getAssignedDeliveries);
router.put("/:id/status", auth, authorize("delivery"), updateDeliveryStatus);
router.put(
  "/availability",
  auth,
  authorize("delivery"),
  updateAvailabilityStatus
);
router.get(
  "/history",
  auth,
  authorize("delivery", "manager"),
  getDeliveryHistory
);

export default router;
