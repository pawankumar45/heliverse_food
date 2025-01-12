"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemSummary = exports.getDeliveryPersonnelSummary = exports.getMealBoxesSummary = exports.getPreparationTasksSummary = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const MealBox_1 = __importDefault(require("../models/MealBox"));
const User_1 = __importDefault(require("../models/User"));
const Patient_1 = __importDefault(require("../models/Patient"));
const DietChart_1 = __importDefault(require("../models/DietChart"));
// Preparation Tasks Summary
const getPreparationTasksSummary = async (req, res) => {
    try {
        const [totalTasks, pendingTasks, inProgressTasks, completedTasks, todaysTasks,] = await Promise.all([
            Task_1.default.countDocuments({ taskType: "preparation" }),
            Task_1.default.countDocuments({ taskType: "preparation", status: "pending" }),
            Task_1.default.countDocuments({ taskType: "preparation", status: "in-progress" }),
            Task_1.default.countDocuments({ taskType: "preparation", status: "completed" }),
            Task_1.default.countDocuments({
                taskType: "preparation",
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            }),
        ]);
        // Get tasks by meal type
        const tasksByMealType = await Task_1.default.aggregate([
            { $match: { taskType: "preparation" } },
            { $group: { _id: "$mealType", count: { $sum: 1 } } },
        ]);
        res.json({
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            today: todaysTasks,
            byMealType: tasksByMealType,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch preparation tasks summary" });
    }
};
exports.getPreparationTasksSummary = getPreparationTasksSummary;
// Meal Boxes Summary
const getMealBoxesSummary = async (req, res) => {
    var _a, _b;
    try {
        const [totalMealBoxes, preparingMealBoxes, readyMealBoxes, assignedMealBoxes, inTransitMealBoxes, deliveredMealBoxes,] = await Promise.all([
            MealBox_1.default.countDocuments(),
            MealBox_1.default.countDocuments({ status: "preparing" }),
            MealBox_1.default.countDocuments({ status: "ready" }),
            MealBox_1.default.countDocuments({ status: "assigned" }),
            MealBox_1.default.countDocuments({ status: "in-transit" }),
            MealBox_1.default.countDocuments({ status: "delivered" }),
        ]);
        // Get meal boxes by meal type
        const mealBoxesByType = await MealBox_1.default.aggregate([
            { $group: { _id: "$mealType", count: { $sum: 1 } } },
        ]);
        // Get today's delivery performance
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayDeliveries = await MealBox_1.default.aggregate([
            {
                $match: {
                    status: "delivered",
                    deliveryTime: { $gte: todayStart },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    avgDeliveryTime: {
                        $avg: {
                            $subtract: ["$deliveryTime", "$createdAt"],
                        },
                    },
                },
            },
        ]);
        res.json({
            total: totalMealBoxes,
            status: {
                preparing: preparingMealBoxes,
                ready: readyMealBoxes,
                assigned: assignedMealBoxes,
                inTransit: inTransitMealBoxes,
                delivered: deliveredMealBoxes,
            },
            byMealType: mealBoxesByType,
            todayPerformance: {
                deliveries: ((_a = todayDeliveries[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                avgDeliveryTime: ((_b = todayDeliveries[0]) === null || _b === void 0 ? void 0 : _b.avgDeliveryTime)
                    ? Math.round(todayDeliveries[0].avgDeliveryTime / (1000 * 60)) // Convert to minutes
                    : 0,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch meal boxes summary" });
    }
};
exports.getMealBoxesSummary = getMealBoxesSummary;
// Delivery Personnel Summary
const getDeliveryPersonnelSummary = async (req, res) => {
    var _a, _b, _c;
    try {
        const [totalDeliveryStaff, availableStaff, busyStaff, offlineStaff] = await Promise.all([
            User_1.default.countDocuments({ role: "delivery" }),
            User_1.default.countDocuments({ role: "delivery", deliveryStatus: "available" }),
            User_1.default.countDocuments({ role: "delivery", deliveryStatus: "busy" }),
            User_1.default.countDocuments({ role: "delivery", deliveryStatus: "offline" }),
        ]);
        // Get performance metrics
        const performanceMetrics = await User_1.default.aggregate([
            { $match: { role: "delivery" } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    totalAssignments: { $sum: "$currentAssignments" },
                },
            },
        ]);
        // Get top performers
        const topPerformers = await User_1.default.find({ role: "delivery" })
            .sort({ rating: -1 })
            .limit(5)
            .select("name rating currentAssignments");
        res.json({
            total: totalDeliveryStaff,
            status: {
                available: availableStaff,
                busy: busyStaff,
                offline: offlineStaff,
            },
            performance: {
                avgRating: ((_a = performanceMetrics[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0,
                totalAssignments: ((_b = performanceMetrics[0]) === null || _b === void 0 ? void 0 : _b.totalAssignments) || 0,
                avgAssignmentsPerPerson: totalDeliveryStaff
                    ? (((_c = performanceMetrics[0]) === null || _c === void 0 ? void 0 : _c.totalAssignments) || 0) / totalDeliveryStaff
                    : 0,
            },
            topPerformers,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch delivery personnel summary" });
    }
};
exports.getDeliveryPersonnelSummary = getDeliveryPersonnelSummary;
// Overall System Summary
const getSystemSummary = async (req, res) => {
    try {
        const [totalPatients, totalDietCharts, totalTasks, totalMealBoxes, totalDeliveryStaff,] = await Promise.all([
            Patient_1.default.countDocuments(),
            DietChart_1.default.countDocuments(),
            Task_1.default.countDocuments(),
            MealBox_1.default.countDocuments(),
            User_1.default.countDocuments({ role: "delivery" }),
        ]);
        // Get today's statistics
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const [todaysTasks, todaysDeliveries, todaysCompletedTasks] = await Promise.all([
            Task_1.default.countDocuments({ createdAt: { $gte: today } }),
            MealBox_1.default.countDocuments({
                status: "delivered",
                deliveryTime: { $gte: today },
            }),
            Task_1.default.countDocuments({
                status: "completed",
                updatedAt: { $gte: today },
            }),
        ]);
        // Get efficiency metrics
        const deliveryEfficiency = await MealBox_1.default.aggregate([
            {
                $match: {
                    status: "delivered",
                    deliveryTime: { $gte: today },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDeliveryTime: {
                        $avg: {
                            $subtract: ["$deliveryTime", "$createdAt"],
                        },
                    },
                },
            },
        ]);
        res.json({
            overview: {
                patients: totalPatients,
                dietCharts: totalDietCharts,
                tasks: totalTasks,
                mealBoxes: totalMealBoxes,
                deliveryStaff: totalDeliveryStaff,
            },
            todayMetrics: {
                newTasks: todaysTasks,
                completedDeliveries: todaysDeliveries,
                completedTasks: todaysCompletedTasks,
                avgDeliveryTime: deliveryEfficiency[0]
                    ? Math.round(deliveryEfficiency[0].avgDeliveryTime / (1000 * 60)) // Convert to minutes
                    : 0,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch system summary" });
    }
};
exports.getSystemSummary = getSystemSummary;
