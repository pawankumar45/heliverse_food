import { Request, Response } from "express";
import Task from "../models/Task";
import Inventory from "../models/Inventory";
import { Types } from "mongoose";

export const getPantryTasks = async (req: any, res: Response) => {
  try {
    const tasks = await Task.find({
      taskType: "preparation",
    })
      .populate("patientId")
      .populate("dietChartId");
    // console.log(tasks);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pantry tasks" });
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        taskType: "preparation",
      },
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task status" });
  }
};

// Inventory Management
export const getInventory = async (req: Request, res: Response) => {
  try {
    const { category, lowStock } = req.query;
    let query: any = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter low stock items if requested
    if (lowStock === "true") {
      query = {
        ...query,
        $expr: {
          $lte: ["$quantity", "$minThreshold"],
        },
      };
    }

    const inventory = await Inventory.find(query).sort({
      category: 1,
      name: 1,
    });

    // Add low stock warning to response
    const formattedInventory = inventory.map((item) => ({
      ...item.toObject(),
      lowStock: item.quantity <= item.minThreshold,
      daysUntilExpiry: item.expiryDate
        ? Math.ceil(
            (new Date(item.expiryDate).getTime() - new Date().getTime()) /
              (1000 * 3600 * 24)
          )
        : null,
    }));

    res.json(formattedInventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { _id, quantity, lastRestocked, expiryDate, notes } = req.body;

    if (!Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid inventory item ID" });
    }

    const updates: any = {};

    if (quantity !== undefined) updates.quantity = quantity;
    if (lastRestocked) updates.lastRestocked = new Date(lastRestocked);
    if (expiryDate) updates.expiryDate = new Date(expiryDate);
    if (notes) updates.notes = notes;

    const updatedItem = await Inventory.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update inventory" });
  }
};

export const addInventoryItem = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      minThreshold,
      location,
      supplier,
      expiryDate,
      notes,
    } = req.body;

    const newItem = new Inventory({
      name,
      category,
      quantity,
      unit,
      minThreshold,
      location,
      supplier,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      notes,
      lastRestocked: new Date(),
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to add inventory item" });
  }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inventory item ID" });
    }

    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: {
        $lte: ["$quantity", "$minThreshold"],
      },
    }).sort({ quantity: 1 });

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock items" });
  }
};

export const getExpiringItems = async (req: Request, res: Response) => {
  try {
    const daysThreshold = parseInt(req.query.days as string) || 7;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const expiringItems = await Inventory.find({
      expiryDate: {
        $exists: true,
        $ne: null,
        $lte: thresholdDate,
      },
    }).sort({ expiryDate: 1 });

    res.json(expiringItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expiring items" });
  }
};
