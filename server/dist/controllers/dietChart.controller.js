"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDietChart = exports.updateDietChart = exports.getDietChart = exports.getDietCharts = exports.getDietChartByPatientId = exports.createDietChart = void 0;
const DietChart_1 = __importDefault(require("../models/DietChart"));
const createDietChart = async (req, res) => {
    try {
        console.log(req.body);
        const dietChart = new DietChart_1.default({
            ...req.body,
            createdBy: req.user.userId,
        });
        await dietChart.save();
        res.status(201).json(dietChart);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create diet chart" });
    }
};
exports.createDietChart = createDietChart;
const getDietChartByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const dietChart = await DietChart_1.default.findOne({ patientId })
            .populate("createdBy", "name")
            .populate("patientId");
        // if (!dietChart) {
        //   return res
        //     .status(404)
        //     .json({ message: "Diet chart not found for this patient" });
        // }
        res.status(200).json(dietChart);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch diet chart" });
    }
};
exports.getDietChartByPatientId = getDietChartByPatientId;
const getDietCharts = async (req, res) => {
    try {
        const dietCharts = await DietChart_1.default.find()
            .populate("createdBy", "name")
            .populate("patientId")
            .sort({ createdAt: -1 });
        // console.log(dietCharts);
        res.status(200).json(dietCharts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch diet charts" });
    }
};
exports.getDietCharts = getDietCharts;
const getDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart_1.default.findById(req.params.id)
            .populate("patientId")
            .populate("createdBy", "name");
        if (!dietChart) {
            return res.status(404).json({ message: "Diet chart not found" });
        }
        res.json(dietChart);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch diet chart" });
    }
};
exports.getDietChart = getDietChart;
const updateDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dietChart) {
            return res.status(404).json({ message: "Diet chart not found" });
        }
        res.json(dietChart);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update diet chart" });
    }
};
exports.updateDietChart = updateDietChart;
const deleteDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart_1.default.findByIdAndDelete(req.params.id);
        if (!dietChart) {
            return res.status(404).json({ message: "Diet chart not found" });
        }
        res.json({ message: "Diet chart deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete diet chart" });
    }
};
exports.deleteDietChart = deleteDietChart;
