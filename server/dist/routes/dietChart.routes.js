"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const dietChart_controller_1 = require("../controllers/dietChart.controller");
const dietChart_controller_2 = require("../controllers/dietChart.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), dietChart_controller_2.createDietChart);
router.get("/", auth_middleware_1.auth, dietChart_controller_2.getDietCharts);
router.get("/:id", auth_middleware_1.auth, dietChart_controller_2.getDietChart);
router.get("/patientId/:patientId", auth_middleware_1.auth, dietChart_controller_1.getDietChartByPatientId);
router.put("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), dietChart_controller_2.updateDietChart);
router.delete("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), dietChart_controller_2.deleteDietChart);
exports.default = router;
