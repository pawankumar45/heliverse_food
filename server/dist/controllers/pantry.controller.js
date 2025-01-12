"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiringItems = exports.getLowStockItems = exports.deleteInventoryItem = exports.addInventoryItem = exports.updateInventory = exports.getInventory = exports.updateTaskStatus = exports.getPantryTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const mongoose_1 = require("mongoose");
const getPantryTasks = async (req, res) => {
    try {
        const tasks = await Task_1.default.find({
            taskType: "preparation",
        })
            .populate("patientId")
            .populate("dietChartId");
        // console.log(tasks);
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch pantry tasks" });
    }
};
exports.getPantryTasks = getPantryTasks;
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task_1.default.findOneAndUpdate({
            _id: req.params.id,
            taskType: "preparation",
        }, { status }, { new: true });
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
// Inventory Management
const getInventory = async (req, res) => {
    try {
        const { category, lowStock } = req.query;
        let query = {};
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
        const inventory = await Inventory_1.default.find(query).sort({
            category: 1,
            name: 1,
        });
        // Add low stock warning to response
        const formattedInventory = inventory.map((item) => ({
            ...item.toObject(),
            lowStock: item.quantity <= item.minThreshold,
            daysUntilExpiry: item.expiryDate
                ? Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) /
                    (1000 * 3600 * 24))
                : null,
        }));
        res.json(formattedInventory);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch inventory" });
    }
};
exports.getInventory = getInventory;
const updateInventory = async (req, res) => {
    try {
        const { _id, quantity, lastRestocked, expiryDate, notes } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid inventory item ID" });
        }
        const updates = {};
        if (quantity !== undefined)
            updates.quantity = quantity;
        if (lastRestocked)
            updates.lastRestocked = new Date(lastRestocked);
        if (expiryDate)
            updates.expiryDate = new Date(expiryDate);
        if (notes)
            updates.notes = notes;
        const updatedItem = await Inventory_1.default.findByIdAndUpdate(_id, { $set: updates }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update inventory" });
    }
};
exports.updateInventory = updateInventory;
const addInventoryItem = async (req, res) => {
    try {
        const { name, category, quantity, unit, minThreshold, location, supplier, expiryDate, notes, } = req.body;
        const newItem = new Inventory_1.default({
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
    }
    catch (error) {
        res.status(400).json({ message: "Failed to add inventory item" });
    }
};
exports.addInventoryItem = addInventoryItem;
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid inventory item ID" });
        }
        const deletedItem = await Inventory_1.default.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.json({ message: "Inventory item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete inventory item" });
    }
};
exports.deleteInventoryItem = deleteInventoryItem;
const getLowStockItems = async (req, res) => {
    try {
        const lowStockItems = await Inventory_1.default.find({
            $expr: {
                $lte: ["$quantity", "$minThreshold"],
            },
        }).sort({ quantity: 1 });
        res.json(lowStockItems);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch low stock items" });
    }
};
exports.getLowStockItems = getLowStockItems;
const getExpiringItems = async (req, res) => {
    try {
        const daysThreshold = parseInt(req.query.days) || 7;
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        const expiringItems = await Inventory_1.default.find({
            expiryDate: {
                $exists: true,
                $ne: null,
                $lte: thresholdDate,
            },
        }).sort({ expiryDate: 1 });
        res.json(expiringItems);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch expiring items" });
    }
};
exports.getExpiringItems = getExpiringItems;
