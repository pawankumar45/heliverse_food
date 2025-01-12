import { Request, Response } from "express";
import Task from "../models/Task";
import MealBox from "../models/MealBox";
import User from "../models/User";

// Task Management
export const getPreparationTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      taskType: "preparation",
      status: { $ne: "completed" },
    })
      .populate("patientId")
      .populate("dietChartId")
      .sort({ createdAt: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preparation tasks" });
  }
};

export const createMealBox = async (req: Request, res: Response) => {
  try {
    const {
      taskId,
      patientId,
      dietChartId,
      mealType,
      specialInstructions,
      preparationNotes,
    } = req.body;

    // Validate required fields
    if (!patientId || !dietChartId || !mealType) {
      return res.status(400).json({
        message: "Patient ID, Diet Chart ID, and meal type are required",
      });
    }

    // Create new meal box
    const mealBox = new MealBox({
      taskId,
      patientId,
      dietChartId,
      mealType,
      status: "preparing",
      specialInstructions,
      preparationNotes,
    });

    await mealBox.save();

    // Populate references and return
    const populatedMealBox = await MealBox.findById(mealBox._id)
      .populate("patientId")
      .populate("dietChartId")
      .populate("taskId");

    res.status(201).json(populatedMealBox);
  } catch (error) {
    res.status(400).json({ message: "Failed to create meal box" });
  }
};

export const updatePreparationStatus = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true })
      .populate("patientId")
      .populate("dietChartId");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (status === "completed") {
      const mealBox = new MealBox({
        taskId: task._id,
        patientId: task.patientId,
        dietChartId: task.dietChartId,
        mealType: task.mealType,
        status: "ready",
        preparationNotes: "Completed",
      });
      await mealBox.save();
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update preparation status" });
  }
};

// Delivery Personnel Management
export const getDeliveryPersonnel = async (req: Request, res: Response) => {
  try {
    const personnel = await User.find({ role: "delivery" })
      .select("-password")
      .sort({ deliveryStatus: 1, name: 1 });
    res.status(200).json(personnel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery personnel" });
  }
};

export const updateDeliveryPersonnel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const personnel = await User.findOneAndUpdate(
      { _id: id, role: "delivery" },
      updates,
      { new: true }
    ).select("-password");

    if (!personnel) {
      return res.status(404).json({ message: "Delivery personnel not found" });
    }

    res.json(personnel);
  } catch (error) {
    res.status(400).json({ message: "Failed to update delivery personnel" });
  }
};

// Meal Box Management
export const assignMealBox = async (req: Request, res: Response) => {
  try {
    const { mealBoxId, deliveryPersonnelId } = req.body;

    // Verify delivery personnel is available
    const personnel = await User.findOne({
      _id: deliveryPersonnelId,
      role: "delivery",
    });

    if (!personnel) {
      return res.status(404).json({ message: "Delivery personnel not found" });
    }

    if (personnel.currentAssignments! >= personnel.maxAssignments!) {
      return res.status(400).json({
        message: "Delivery personnel has reached maximum assignments",
      });
    }

    // Update meal box
    const mealBox = await MealBox.findByIdAndUpdate(
      mealBoxId,
      {
        deliveryPersonnelId,
        status: "assigned",
      },
      { new: true }
    )
      .populate("patientId")
      .populate("dietChartId")
      .populate("deliveryPersonnelId", "-password");

    if (!mealBox) {
      return res.status(404).json({ message: "Meal box not found" });
    }

    // Update delivery personnel assignments
    await User.findByIdAndUpdate(deliveryPersonnelId, {
      $inc: { currentAssignments: 1 },
      deliveryStatus: "busy",
    });

    res.json(mealBox);
  } catch (error) {
    res.status(400).json({ message: "Failed to assign meal box" });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { mealBoxId } = req.params;
    const { status, deliveryNotes } = req.body;

    const mealBox = await MealBox.findById(mealBoxId);
    if (!mealBox) {
      return res.status(404).json({ message: "Meal box not found" });
    }

    mealBox.status = status;
    mealBox.deliveryNotes = deliveryNotes;

    if (status === "delivered") {
      mealBox.deliveryTime = new Date();

      // Update delivery personnel status
      if (mealBox.deliveryPersonnelId) {
        await User.findByIdAndUpdate(mealBox.deliveryPersonnelId, {
          $inc: { currentAssignments: -1 },
          $set: { deliveryStatus: "available" },
        });
      }
    }

    await mealBox.save();

    const updatedMealBox = await MealBox.findById(mealBoxId)
      .populate("patientId")
      .populate("dietChartId")
      .populate("deliveryPersonnelId", "-password");

    res.json(updatedMealBox);
  } catch (error) {
    res.status(400).json({ message: "Failed to update delivery status" });
  }
};

export const getMealBoxes = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const mealBoxes = await MealBox.find(query)
      .populate("patientId")
      .populate("dietChartId")
      .populate("deliveryPersonnelId", "-password")
      .sort({ createdAt: -1 });

    res.json(mealBoxes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal boxes" });
  }
};

export const deleteMealBox = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mealBox = await MealBox.findByIdAndDelete(id);

    if (!mealBox) {
      return res.status(404).json({ message: "Meal box not found" });
    }

    if (mealBox.deliveryPersonnelId) {
      await User.findByIdAndUpdate(mealBox.deliveryPersonnelId, {
        $inc: { currentAssignments: -1 },
        $set: { deliveryStatus: "available" },
      });
    }

    res.status(200).json({ message: "Meal box deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete meal box" });
  }
};
