"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.login);
router.post("/register", auth_controller_1.register);
router.get("/logout", auth_controller_1.logout);
router.get("/validate-token", auth_controller_1.validateToken);
router.get("/users", auth_middleware_1.auth, (0, auth_middleware_1.authorize)("manager"), auth_controller_1.getAllUsersExceptManagers);
router.get("/user", auth_middleware_1.auth, auth_controller_1.getUserById);
router.put("/user", auth_middleware_1.auth, auth_controller_1.updateUser);
exports.default = router;
