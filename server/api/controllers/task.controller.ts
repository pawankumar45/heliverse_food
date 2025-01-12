import { Request, Response } from "express";
import Task from "../models/Task";

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("patientId")
      .populate("dietChartId")
      .populate("assignedTo", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("patientId")
      .populate("dietChartId")
      .populate("assignedTo", "name");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task" });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
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

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
