import express from "express";
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller";
import { auth, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, authorize("manager"), createPatient);
router.get("/", auth, getPatients);
router.get("/:id", auth, getPatient);
router.put("/:id", auth, authorize("manager"), updatePatient);
router.delete("/:id", auth, authorize("manager"), deletePatient);

export default router;
