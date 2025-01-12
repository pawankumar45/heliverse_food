"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const createTask = async (req, res) => {
    try {
        const task = new Task_1.default(req.body);
        await task.save();
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create task" });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const tasks = await Task_1.default.find()
            .populate("patientId")
            .populate("dietChartId")
            .populate("assignedTo", "name");
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};
exports.getTasks = getTasks;
const getTask = async (req, res) => {
    try {
        const task = await Task_1.default.findById(req.params.id)
            .populate("patientId")
            .populate("dietChartId")
            .populate("assignedTo", "name");
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch task" });
    }
};
exports.getTask = getTask;
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update task status" });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
