import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; Max-Age=${
        COOKIE_OPTIONS.maxAge / 1000
      }; HttpOnly; ${COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=None`,
    ]);

    res.json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password, role, phone, address });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; Max-Age=${
        COOKIE_OPTIONS.maxAge / 1000
      }; HttpOnly; ${COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=None`,
    ]);

    res
      .status(201)
      .json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.setHeader("Set-Cookie", [
    `token=; Path=/; Max-Age=0; HttpOnly; ${
      COOKIE_OPTIONS.secure ? "Secure;" : ""
    } SameSite=None`,
  ]);
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId).select("name role email");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Token validation failed" });
  }
};

export const getAllUsersExceptManagers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find({ role: { $ne: "manager" } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, address, phone, email } = req.body;

    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
