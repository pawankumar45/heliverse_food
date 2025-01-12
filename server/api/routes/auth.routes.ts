import express from "express";
import {
  getAllUsersExceptManagers,
  getUserById,
  login,
  logout,
  register,
  updateUser,
  validateToken,
} from "../controllers/auth.controller";
import { auth, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/validate-token", validateToken);
router.get("/users", auth, authorize("manager"), getAllUsersExceptManagers);
router.get("/user", auth, getUserById);
router.put("/user", auth, updateUser);

export default router;
