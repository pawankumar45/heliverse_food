import express from "express";
import { auth, authorize } from "../middleware/auth.middleware";
import { getDietChartByPatientId } from "../controllers/dietChart.controller";
import {
  createDietChart,
  getDietCharts,
  getDietChart,
  updateDietChart,
  deleteDietChart,
} from "../controllers/dietChart.controller";

const router = express.Router();

router.post("/", auth, authorize("manager"), createDietChart);
router.get("/", auth, getDietCharts);
router.get("/:id", auth, getDietChart);
router.get("/patientId/:patientId", auth, getDietChartByPatientId);
router.put("/:id", auth, authorize("manager"), updateDietChart);
router.delete("/:id", auth, authorize("manager"), deleteDietChart);

export default router;
