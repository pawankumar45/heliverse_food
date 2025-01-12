"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryHistory = exports.updateAvailabilityStatus = exports.updateDeliveryStatus = exports.getAssignedDeliveries = exports.confirmDelivery = exports.getAllMealTasks = exports.getAllDeliveryTasks = exports.getDeliveryTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const MealBox_1 = __importDefault(require("../models/MealBox"));
const User_1 = __importDefault(require("../models/User"));
const getDeliveryTasks = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }
        const tasks = await Task_1.default.find({
            assignedTo: req.user.userId,
            taskType: "delivery",
        })
            .populate("patientId")
            .populate("dietChartId");
        console.log("tasks:", JSON.stringify(tasks, null, 2)); // For better readability in logs
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "Failed to fetch delivery tasks" });
    }
};
exports.getDeliveryTasks = getDeliveryTasks;
const getAllDeliveryTasks = async (req, res) => {
    try {
        const tasks = await Task_1.default.find({
            taskType: "delivery",
        })
            .populate("patientId")
            .populate("dietChartId")
            .populate("assignedTo");
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
    }
};
exports.getAllDeliveryTasks = getAllDeliveryTasks;
const getAllMealTasks = async (req, res) => {
    try {
        const tasks = await Task_1.default.find({
            taskType: "preparation",
        })
            .populate("patientId")
            .populate("dietChartId")
            .populate("assignedTo");
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
    }
};
exports.getAllMealTasks = getAllMealTasks;
// export const updateDeliveryStatus = async (req: any, res: Response) => {
//   try {
//     if (
//       !req.body.status ||
//       !["pending", "in-progress", "completed"].includes(req.body.status)
//     ) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }
//     const task = await Task.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         assignedTo: req.user.userId,
//         taskType: "delivery",
//       },
//       { status: req.body.status },
//       { new: true }
//     );
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     res.json(task);
//   } catch (error) {
//     console.error(error); // Log the error for debugging purposes
//     res.status(400).json({ message: "Failed to update delivery status" });
//   }
// };
// export const getDeliveryHistory = async (req: any, res: Response) => {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(400).json({ message: "User not authenticated" });
//     }
//     const tasks = await Task.find({
//       assignedTo: req.user.userId,
//       taskType: "delivery",
//       status: "completed",
//     })
//       .populate("patientId")
//       .populate("dietChartId")
//       .sort({ updatedAt: -1 });
//     res.json(tasks);
//   } catch (error) {
//     console.error(error); // Log the error for debugging purposes
//     res.status(500).json({ message: "Failed to fetch delivery history" });
//   }
// };
const confirmDelivery = async (req, res) => {
    try {
        if (!req.body.notes || req.body.notes.trim() === "") {
            return res.status(400).json({ message: "Notes are required" });
        }
        const task = await Task_1.default.findOneAndUpdate({
            _id: req.params.id,
            assignedTo: req.user.userId,
            taskType: "delivery",
        }, {
            status: "completed",
            notes: req.body.notes,
        }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(400).json({ message: "Failed to confirm delivery" });
    }
};
exports.confirmDelivery = confirmDelivery;
const getAssignedDeliveries = async (req, res) => {
    try {
        const deliveries = await MealBox_1.default.find({
            deliveryPersonnelId: req.user.userId,
            status: { $in: ["assigned", "in-transit"] },
        })
            .populate("patientId")
            .populate("dietChartId");
        res.json(deliveries);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch assigned deliveries" });
    }
};
exports.getAssignedDeliveries = getAssignedDeliveries;
// Update delivery status
const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, deliveryNotes } = req.body;
        const mealBox = await MealBox_1.default.findOneAndUpdate({
            _id: req.params.id,
            deliveryPersonnelId: req.user.userId,
        }, {
            status,
            deliveryNotes,
            ...(status === "delivered" ? { deliveryTime: new Date() } : {}),
        }, { new: true });
        if (!mealBox) {
            return res.status(404).json({ message: "Meal box not found" });
        }
        res.json(mealBox);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update delivery status" });
    }
};
exports.updateDeliveryStatus = updateDeliveryStatus;
// Update availability status
const updateAvailabilityStatus = async (req, res) => {
    try {
        const { deliveryStatus } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user.userId, { deliveryStatus }, { new: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update availability status" });
    }
};
exports.updateAvailabilityStatus = updateAvailabilityStatus;
// Get delivery history
const getDeliveryHistory = async (req, res) => {
    try {
        const history = await MealBox_1.default.find({
            deliveryPersonnelId: req.user.userId,
            status: "delivered",
        })
            .populate("patientId")
            .populate("dietChartId")
            .sort({ deliveryTime: -1 });
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch delivery history" });
    }
};
exports.getDeliveryHistory = getDeliveryHistory;
