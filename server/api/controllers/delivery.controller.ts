import { Request, Response } from "express";
import Task from "../models/Task";
import MealBox from "../models/MealBox";
import User from "../models/User";

export const getDeliveryTasks = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const tasks = await Task.find({
      assignedTo: req.user.userId,
      taskType: "delivery",
    })
      .populate("patientId")
      .populate("dietChartId");

    console.log("tasks:", JSON.stringify(tasks, null, 2)); // For better readability in logs

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "Failed to fetch delivery tasks" });
  }
};

export const getAllDeliveryTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      taskType: "delivery",
    })
      .populate("patientId")
      .populate("dietChartId")
      .populate("assignedTo");

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
  }
};

export const getAllMealTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      taskType: "preparation",
    })
      .populate("patientId")
      .populate("dietChartId")
      .populate("assignedTo");

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
  }
};

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

export const confirmDelivery = async (req: any, res: Response) => {
  try {
    if (!req.body.notes || req.body.notes.trim() === "") {
      return res.status(400).json({ message: "Notes are required" });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        assignedTo: req.user.userId,
        taskType: "delivery",
      },
      {
        status: "completed",
        notes: req.body.notes,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: "Failed to confirm delivery" });
  }
};

export const getAssignedDeliveries = async (req: any, res: Response) => {
  try {
    const deliveries = await MealBox.find({
      deliveryPersonnelId: req.user.userId,
      status: { $in: ["assigned", "in-transit"] },
    })
      .populate("patientId")
      .populate("dietChartId");
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assigned deliveries" });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req: any, res: Response) => {
  try {
    const { status, deliveryNotes } = req.body;
    const mealBox = await MealBox.findOneAndUpdate(
      {
        _id: req.params.id,
        deliveryPersonnelId: req.user.userId,
      },
      {
        status,
        deliveryNotes,
        ...(status === "delivered" ? { deliveryTime: new Date() } : {}),
      },
      { new: true }
    );

    if (!mealBox) {
      return res.status(404).json({ message: "Meal box not found" });
    }

    res.json(mealBox);
  } catch (error) {
    res.status(400).json({ message: "Failed to update delivery status" });
  }
};

// Update availability status
export const updateAvailabilityStatus = async (req: any, res: Response) => {
  try {
    const { deliveryStatus } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { deliveryStatus },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Failed to update availability status" });
  }
};

// Get delivery history
export const getDeliveryHistory = async (req: any, res: Response) => {
  try {
    const history = await MealBox.find({
      deliveryPersonnelId: req.user.userId,
      status: "delivered",
    })
      .populate("patientId")
      .populate("dietChartId")
      .sort({ deliveryTime: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery history" });
  }
};
