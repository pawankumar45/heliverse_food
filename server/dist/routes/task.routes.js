"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('manager'), task_controller_1.createTask);
router.get('/', auth_middleware_1.auth, task_controller_1.getTasks);
router.get('/:id', auth_middleware_1.auth, task_controller_1.getTask);
router.put('/:id', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('manager'), task_controller_1.updateTask);
router.put('/:id/status', auth_middleware_1.auth, task_controller_1.updateTaskStatus);
router.delete('/:id', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('manager'), task_controller_1.deleteTask);
exports.default = router;
