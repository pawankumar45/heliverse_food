"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), patient_controller_1.createPatient);
router.get("/", auth_middleware_1.auth, patient_controller_1.getPatients);
router.get("/:id", auth_middleware_1.auth, patient_controller_1.getPatient);
router.put("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), patient_controller_1.updatePatient);
router.delete("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), patient_controller_1.deletePatient);
exports.default = router;
