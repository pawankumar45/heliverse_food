"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getAllUsersExceptManagers = exports.validateToken = exports.logout = exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "24h",
        });
        res.setHeader("Set-Cookie", [
            `token=${token}; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge / 1000}; HttpOnly; ${COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=None`,
        ]);
        res.json({ user: { id: user._id, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, address } = req.body;
        if (await User_1.default.findOne({ email })) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const user = new User_1.default({ name, email, password, role, phone, address });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "24h",
        });
        res.setHeader("Set-Cookie", [
            `token=${token}; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge / 1000}; HttpOnly; ${COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=None`,
        ]);
        res
            .status(201)
            .json({ user: { id: user._id, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
const validateToken = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select("name role email");
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(401).json({ message: "Token validation failed" });
    }
};
exports.validateToken = validateToken;
const getAllUsersExceptManagers = async (req, res) => {
    try {
        const users = await User_1.default.find({ role: { $ne: "manager" } });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllUsersExceptManagers = getAllUsersExceptManagers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { name, address, phone, email } = req.body;
        if (name)
            user.name = name;
        if (address)
            user.address = address;
        if (phone)
            user.phone = phone;
        if (email)
            user.email = email;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateUser = updateUser;
