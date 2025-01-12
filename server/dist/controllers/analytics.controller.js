"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceMetrics = exports.getDeliveryHistory = exports.getCurrentDeliveries = exports.getPersonalDeliveryStats = exports.getTaskCompletionRate = exports.getIngredientUsage = exports.getMealPreparationTrend = exports.getInventoryLevels = exports.getWeeklyMealPreparation = exports.getDietaryRestrictions = exports.getMealDistribution = exports.getPatientStats = exports.getDeliveryStats = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const MealBox_1 = __importDefault(require("../models/MealBox"));
const User_1 = __importDefault(require("../models/User"));
const Patient_1 = __importDefault(require("../models/Patient"));
const DietChart_1 = __importDefault(require("../models/DietChart"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const mongoose_1 = __importDefault(require("mongoose"));
// Manager Dashboard Analytics
const getDeliveryStats = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const deliveryStats = await MealBox_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    delivered: {
                        $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
                    },
                    pending: {
                        $sum: { $cond: [{ $ne: ["$status", "delivered"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    delivered: 1,
                    pending: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
        res.json(deliveryStats);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch delivery stats" });
    }
};
exports.getDeliveryStats = getDeliveryStats;
const getPatientStats = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const patientStats = await Patient_1.default.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$otherDetails.admissionDate",
                        },
                    },
                    total: { $sum: 1 },
                    new: {
                        $sum: {
                            $cond: [
                                { $gte: ["$otherDetails.admissionDate", last30Days] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    total: 1,
                    new: 1,
                    discharged: { $subtract: ["$total", "$new"] },
                },
            },
            { $sort: { date: 1 } },
        ]);
        res.json(patientStats);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch patient stats" });
    }
};
exports.getPatientStats = getPatientStats;
const getMealDistribution = async (req, res) => {
    try {
        const distribution = await MealBox_1.default.aggregate([
            {
                $group: {
                    _id: "$mealType",
                    value: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1,
                },
            },
        ]);
        res.json(distribution);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch meal distribution" });
    }
};
exports.getMealDistribution = getMealDistribution;
const getDietaryRestrictions = async (req, res) => {
    try {
        const restrictions = await Patient_1.default.aggregate([
            { $unwind: "$otherDetails.dietaryRestrictions" },
            {
                $group: {
                    _id: "$otherDetails.dietaryRestrictions",
                    value: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1,
                },
            },
            { $sort: { value: -1 } },
            { $limit: 10 },
        ]);
        res.json(restrictions);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch dietary restrictions" });
    }
};
exports.getDietaryRestrictions = getDietaryRestrictions;
const getWeeklyMealPreparation = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyPrep = await MealBox_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        mealType: "$mealType",
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id.day",
                    mealType: "$_id.mealType",
                    count: 1,
                },
            },
            {
                $group: {
                    _id: "$day",
                    breakfast: {
                        $sum: { $cond: [{ $eq: ["$mealType", "morning"] }, "$count", 0] },
                    },
                    lunch: {
                        $sum: { $cond: [{ $eq: ["$mealType", "afternoon"] }, "$count", 0] },
                    },
                    dinner: {
                        $sum: { $cond: [{ $eq: ["$mealType", "night"] }, "$count", 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id",
                    breakfast: 1,
                    lunch: 1,
                    dinner: 1,
                },
            },
            { $sort: { day: 1 } },
        ]);
        res.json(weeklyPrep);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch weekly meal preparation" });
    }
};
exports.getWeeklyMealPreparation = getWeeklyMealPreparation;
// Pantry Dashboard Analytics
const getInventoryLevels = async (req, res) => {
    try {
        const levels = await Inventory_1.default.aggregate([
            {
                $project: {
                    name: 1,
                    current: "$quantity",
                    minimum: "$minThreshold",
                },
            },
            { $sort: { name: 1 } },
        ]);
        res.json(levels);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch inventory levels" });
    }
};
exports.getInventoryLevels = getInventoryLevels;
const getMealPreparationTrend = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const trend = await MealBox_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: last30Days },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    prepared: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    prepared: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
        res.json(trend);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch meal preparation trend" });
    }
};
exports.getMealPreparationTrend = getMealPreparationTrend;
const getIngredientUsage = async (req, res) => {
    try {
        // This is a simplified version. In a real application, you'd track ingredient usage
        // through a separate collection or relationship
        const usage = await DietChart_1.default.aggregate([
            { $unwind: "$meals.morning.ingredients" },
            {
                $group: {
                    _id: "$meals.morning.ingredients",
                    value: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1,
                },
            },
            { $sort: { value: -1 } },
            { $limit: 5 },
        ]);
        res.json(usage);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch ingredient usage" });
    }
};
exports.getIngredientUsage = getIngredientUsage;
const getTaskCompletionRate = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const completionRate = await Task_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: last30Days },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    rate: {
                        $multiply: [{ $divide: ["$completed", "$total"] }, 100],
                    },
                },
            },
            { $sort: { date: 1 } },
        ]);
        res.json(completionRate);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch task completion rate" });
    }
};
exports.getTaskCompletionRate = getTaskCompletionRate;
// Delivery Analytics
const getPersonalDeliveryStats = async (req, res) => {
    try {
        const stats = await Task_1.default.aggregate([
            {
                $match: {
                    taskType: "delivery",
                    assignedTo: new mongoose_1.default.Types.ObjectId(req.user.userId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalDeliveries: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                        },
                    },
                    inProgress: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
                        },
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalDeliveries: 1,
                    completed: 1,
                    inProgress: 1,
                    pending: 1,
                },
            },
        ]);
        res.json(stats[0] || {
            totalDeliveries: 0,
            completed: 0,
            inProgress: 0,
            pending: 0,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch delivery stats" });
    }
};
exports.getPersonalDeliveryStats = getPersonalDeliveryStats;
const getCurrentDeliveries = async (req, res) => {
    try {
        const deliveries = await MealBox_1.default.find({
            deliveryPersonnelId: req.user.userId,
            status: { $in: ["assigned", "in-transit"] },
        })
            .populate("patientId", "name roomDetails")
            .sort({ createdAt: 1 })
            .select("status mealType patientId createdAt");
        res.json(deliveries);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch current deliveries" });
    }
};
exports.getCurrentDeliveries = getCurrentDeliveries;
const getDeliveryHistory = async (req, res) => {
    try {
        const history = await MealBox_1.default.find({
            deliveryPersonnelId: req.user.userId,
            status: "delivered",
        })
            .populate("patientId", "name roomDetails")
            .sort({ deliveryTime: -1 })
            .limit(10)
            .select("mealType deliveryTime patientId");
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch delivery history" });
    }
};
exports.getDeliveryHistory = getDeliveryHistory;
const getPerformanceMetrics = async (req, res) => {
    try {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const deliveryPerson = await User_1.default.findById(req.user.userId).select("rating currentAssignments maxAssignments");
        const deliveryTimes = await MealBox_1.default.aggregate([
            {
                $match: {
                    deliveryPersonnelId: req.user.userId,
                    status: "delivered",
                    deliveryTime: { $gte: today },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDeliveryTime: {
                        $avg: { $subtract: ["$deliveryTime", "$createdAt"] },
                    },
                },
            },
        ]);
        res.json({
            rating: (deliveryPerson === null || deliveryPerson === void 0 ? void 0 : deliveryPerson.rating) || 5,
            currentAssignments: (deliveryPerson === null || deliveryPerson === void 0 ? void 0 : deliveryPerson.currentAssignments) || 0,
            maxAssignments: (deliveryPerson === null || deliveryPerson === void 0 ? void 0 : deliveryPerson.maxAssignments) || 5,
            avgDeliveryTime: deliveryTimes[0]
                ? Math.round(deliveryTimes[0].avgDeliveryTime / (1000 * 60)) // Convert to minutes
                : 0,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch performance metrics" });
    }
};
exports.getPerformanceMetrics = getPerformanceMetrics;
