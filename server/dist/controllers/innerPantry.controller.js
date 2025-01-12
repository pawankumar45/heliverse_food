"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMealBox = exports.getMealBoxes = exports.updateDeliveryStatus = exports.assignMealBox = exports.updateDeliveryPersonnel = exports.getDeliveryPersonnel = exports.updatePreparationStatus = exports.createMealBox = exports.getPreparationTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const MealBox_1 = __importDefault(require("../models/MealBox"));
const User_1 = __importDefault(require("../models/User"));
// Task Management
const getPreparationTasks = async (req, res) => {
    try {
        const tasks = await Task_1.default.find({
            taskType: "preparation",
            status: { $ne: "completed" },
        })
            .populate("patientId")
            .populate("dietChartId")
            .sort({ createdAt: 1 });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch preparation tasks" });
    }
};
exports.getPreparationTasks = getPreparationTasks;
const createMealBox = async (req, res) => {
    try {
        const { taskId, patientId, dietChartId, mealType, specialInstructions, preparationNotes, } = req.body;
        // Validate required fields
        if (!patientId || !dietChartId || !mealType) {
            return res.status(400).json({
                message: "Patient ID, Diet Chart ID, and meal type are required",
            });
        }
        // Create new meal box
        const mealBox = new MealBox_1.default({
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
        const populatedMealBox = await MealBox_1.default.findById(mealBox._id)
            .populate("patientId")
            .populate("dietChartId")
            .populate("taskId");
        res.status(201).json(populatedMealBox);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create meal box" });
    }
};
exports.createMealBox = createMealBox;
const updatePreparationStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const task = await Task_1.default.findByIdAndUpdate(taskId, { status }, { new: true })
            .populate("patientId")
            .populate("dietChartId");
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (status === "completed") {
            const mealBox = new MealBox_1.default({
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
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update preparation status" });
    }
};
exports.updatePreparationStatus = updatePreparationStatus;
// Delivery Personnel Management
const getDeliveryPersonnel = async (req, res) => {
    try {
        const personnel = await User_1.default.find({ role: "delivery" })
            .select("-password")
            .sort({ deliveryStatus: 1, name: 1 });
        res.status(200).json(personnel);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch delivery personnel" });
    }
};
exports.getDeliveryPersonnel = getDeliveryPersonnel;
const updateDeliveryPersonnel = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const personnel = await User_1.default.findOneAndUpdate({ _id: id, role: "delivery" }, updates, { new: true }).select("-password");
        if (!personnel) {
            return res.status(404).json({ message: "Delivery personnel not found" });
        }
        res.json(personnel);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update delivery personnel" });
    }
};
exports.updateDeliveryPersonnel = updateDeliveryPersonnel;
// Meal Box Management
const assignMealBox = async (req, res) => {
    try {
        const { mealBoxId, deliveryPersonnelId } = req.body;
        // Verify delivery personnel is available
        const personnel = await User_1.default.findOne({
            _id: deliveryPersonnelId,
            role: "delivery",
        });
        if (!personnel) {
            return res.status(404).json({ message: "Delivery personnel not found" });
        }
        if (personnel.currentAssignments >= personnel.maxAssignments) {
            return res.status(400).json({
                message: "Delivery personnel has reached maximum assignments",
            });
        }
        // Update meal box
        const mealBox = await MealBox_1.default.findByIdAndUpdate(mealBoxId, {
            deliveryPersonnelId,
            status: "assigned",
        }, { new: true })
            .populate("patientId")
            .populate("dietChartId")
            .populate("deliveryPersonnelId", "-password");
        if (!mealBox) {
            return res.status(404).json({ message: "Meal box not found" });
        }
        // Update delivery personnel assignments
        await User_1.default.findByIdAndUpdate(deliveryPersonnelId, {
            $inc: { currentAssignments: 1 },
            deliveryStatus: "busy",
        });
        res.json(mealBox);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to assign meal box" });
    }
};
exports.assignMealBox = assignMealBox;
const updateDeliveryStatus = async (req, res) => {
    try {
        const { mealBoxId } = req.params;
        const { status, deliveryNotes } = req.body;
        const mealBox = await MealBox_1.default.findById(mealBoxId);
        if (!mealBox) {
            return res.status(404).json({ message: "Meal box not found" });
        }
        mealBox.status = status;
        mealBox.deliveryNotes = deliveryNotes;
        if (status === "delivered") {
            mealBox.deliveryTime = new Date();
            // Update delivery personnel status
            if (mealBox.deliveryPersonnelId) {
                await User_1.default.findByIdAndUpdate(mealBox.deliveryPersonnelId, {
                    $inc: { currentAssignments: -1 },
                    $set: { deliveryStatus: "available" },
                });
            }
        }
        await mealBox.save();
        const updatedMealBox = await MealBox_1.default.findById(mealBoxId)
            .populate("patientId")
            .populate("dietChartId")
            .populate("deliveryPersonnelId", "-password");
        res.json(updatedMealBox);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update delivery status" });
    }
};
exports.updateDeliveryStatus = updateDeliveryStatus;
const getMealBoxes = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        const mealBoxes = await MealBox_1.default.find(query)
            .populate("patientId")
            .populate("dietChartId")
            .populate("deliveryPersonnelId", "-password")
            .sort({ createdAt: -1 });
        res.json(mealBoxes);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch meal boxes" });
    }
};
exports.getMealBoxes = getMealBoxes;
const deleteMealBox = async (req, res) => {
    try {
        const { id } = req.params;
        const mealBox = await MealBox_1.default.findByIdAndDelete(id);
        if (!mealBox) {
            return res.status(404).json({ message: "Meal box not found" });
        }
        if (mealBox.deliveryPersonnelId) {
            await User_1.default.findByIdAndUpdate(mealBox.deliveryPersonnelId, {
                $inc: { currentAssignments: -1 },
                $set: { deliveryStatus: "available" },
            });
        }
        res.status(200).json({ message: "Meal box deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete meal box" });
    }
};
exports.deleteMealBox = deleteMealBox;
