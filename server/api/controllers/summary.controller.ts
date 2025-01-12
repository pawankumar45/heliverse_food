import { Request, Response } from "express";
import Task from "../models/Task";
import MealBox from "../models/MealBox";
import User from "../models/User";
import Patient from "../models/Patient";
import DietChart from "../models/DietChart";

// Preparation Tasks Summary
export const getPreparationTasksSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      todaysTasks,
    ] = await Promise.all([
      Task.countDocuments({ taskType: "preparation" }),
      Task.countDocuments({ taskType: "preparation", status: "pending" }),
      Task.countDocuments({ taskType: "preparation", status: "in-progress" }),
      Task.countDocuments({ taskType: "preparation", status: "completed" }),
      Task.countDocuments({
        taskType: "preparation",
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
    ]);

    // Get tasks by meal type
    const tasksByMealType = await Task.aggregate([
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch preparation tasks summary" });
  }
};

// Meal Boxes Summary
export const getMealBoxesSummary = async (req: Request, res: Response) => {
  try {
    const [
      totalMealBoxes,
      preparingMealBoxes,
      readyMealBoxes,
      assignedMealBoxes,
      inTransitMealBoxes,
      deliveredMealBoxes,
    ] = await Promise.all([
      MealBox.countDocuments(),
      MealBox.countDocuments({ status: "preparing" }),
      MealBox.countDocuments({ status: "ready" }),
      MealBox.countDocuments({ status: "assigned" }),
      MealBox.countDocuments({ status: "in-transit" }),
      MealBox.countDocuments({ status: "delivered" }),
    ]);

    // Get meal boxes by meal type
    const mealBoxesByType = await MealBox.aggregate([
      { $group: { _id: "$mealType", count: { $sum: 1 } } },
    ]);

    // Get today's delivery performance
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayDeliveries = await MealBox.aggregate([
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
        deliveries: todayDeliveries[0]?.count || 0,
        avgDeliveryTime: todayDeliveries[0]?.avgDeliveryTime
          ? Math.round(todayDeliveries[0].avgDeliveryTime / (1000 * 60)) // Convert to minutes
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal boxes summary" });
  }
};

// Delivery Personnel Summary
export const getDeliveryPersonnelSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const [totalDeliveryStaff, availableStaff, busyStaff, offlineStaff] =
      await Promise.all([
        User.countDocuments({ role: "delivery" }),
        User.countDocuments({ role: "delivery", deliveryStatus: "available" }),
        User.countDocuments({ role: "delivery", deliveryStatus: "busy" }),
        User.countDocuments({ role: "delivery", deliveryStatus: "offline" }),
      ]);

    // Get performance metrics
    const performanceMetrics = await User.aggregate([
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
    const topPerformers = await User.find({ role: "delivery" })
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
        avgRating: performanceMetrics[0]?.avgRating || 0,
        totalAssignments: performanceMetrics[0]?.totalAssignments || 0,
        avgAssignmentsPerPerson: totalDeliveryStaff
          ? (performanceMetrics[0]?.totalAssignments || 0) / totalDeliveryStaff
          : 0,
      },
      topPerformers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch delivery personnel summary" });
  }
};

// Overall System Summary
export const getSystemSummary = async (req: Request, res: Response) => {
  try {
    const [
      totalPatients,
      totalDietCharts,
      totalTasks,
      totalMealBoxes,
      totalDeliveryStaff,
    ] = await Promise.all([
      Patient.countDocuments(),
      DietChart.countDocuments(),
      Task.countDocuments(),
      MealBox.countDocuments(),
      User.countDocuments({ role: "delivery" }),
    ]);

    // Get today's statistics
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const [todaysTasks, todaysDeliveries, todaysCompletedTasks] =
      await Promise.all([
        Task.countDocuments({ createdAt: { $gte: today } }),
        MealBox.countDocuments({
          status: "delivered",
          deliveryTime: { $gte: today },
        }),
        Task.countDocuments({
          status: "completed",
          updatedAt: { $gte: today },
        }),
      ]);

    // Get efficiency metrics
    const deliveryEfficiency = await MealBox.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch system summary" });
  }
};
