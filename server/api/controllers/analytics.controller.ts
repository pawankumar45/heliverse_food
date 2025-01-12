import { Request, Response } from "express";
import Task from "../models/Task";
import MealBox from "../models/MealBox";
import User from "../models/User";
import Patient from "../models/Patient";
import DietChart from "../models/DietChart";
import Inventory from "../models/Inventory";
import mongoose from "mongoose";

// Manager Dashboard Analytics
export const getDeliveryStats = async (req: Request, res: Response) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const deliveryStats = await MealBox.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery stats" });
  }
};

export const getPatientStats = async (req: Request, res: Response) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const patientStats = await Patient.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient stats" });
  }
};

export const getMealDistribution = async (req: Request, res: Response) => {
  try {
    const distribution = await MealBox.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal distribution" });
  }
};

export const getDietaryRestrictions = async (req: Request, res: Response) => {
  try {
    const restrictions = await Patient.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dietary restrictions" });
  }
};

export const getWeeklyMealPreparation = async (req: Request, res: Response) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyPrep = await MealBox.aggregate([
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch weekly meal preparation" });
  }
};

// Pantry Dashboard Analytics
export const getInventoryLevels = async (req: Request, res: Response) => {
  try {
    const levels = await Inventory.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory levels" });
  }
};

export const getMealPreparationTrend = async (req: Request, res: Response) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const trend = await MealBox.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal preparation trend" });
  }
};

export const getIngredientUsage = async (req: Request, res: Response) => {
  try {
    // This is a simplified version. In a real application, you'd track ingredient usage
    // through a separate collection or relationship
    const usage = await DietChart.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ingredient usage" });
  }
};

export const getTaskCompletionRate = async (req: Request, res: Response) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const completionRate = await Task.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task completion rate" });
  }
};

// Delivery Analytics
export const getPersonalDeliveryStats = async (req: any, res: Response) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          taskType: "delivery",
          assignedTo: new mongoose.Types.ObjectId(req.user.userId),
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

    res.json(
      stats[0] || {
        totalDeliveries: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery stats" });
  }
};

export const getCurrentDeliveries = async (req: any, res: Response) => {
  try {
    const deliveries = await MealBox.find({
      deliveryPersonnelId: req.user.userId,
      status: { $in: ["assigned", "in-transit"] },
    })
      .populate("patientId", "name roomDetails")
      .sort({ createdAt: 1 })
      .select("status mealType patientId createdAt");

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch current deliveries" });
  }
};

export const getDeliveryHistory = async (req: any, res: Response) => {
  try {
    const history = await MealBox.find({
      deliveryPersonnelId: req.user.userId,
      status: "delivered",
    })
      .populate("patientId", "name roomDetails")
      .sort({ deliveryTime: -1 })
      .limit(10)
      .select("mealType deliveryTime patientId");

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery history" });
  }
};

export const getPerformanceMetrics = async (req: any, res: Response) => {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const deliveryPerson = await User.findById(req.user.userId).select(
      "rating currentAssignments maxAssignments"
    );

    const deliveryTimes = await MealBox.aggregate([
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
      rating: deliveryPerson?.rating || 5,
      currentAssignments: deliveryPerson?.currentAssignments || 0,
      maxAssignments: deliveryPerson?.maxAssignments || 5,
      avgDeliveryTime: deliveryTimes[0]
        ? Math.round(deliveryTimes[0].avgDeliveryTime / (1000 * 60)) // Convert to minutes
        : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch performance metrics" });
  }
};
