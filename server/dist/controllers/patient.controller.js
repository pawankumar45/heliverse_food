"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatient = exports.getPatients = exports.createPatient = void 0;
const Patient_1 = __importDefault(require("../models/Patient"));
const createPatient = async (req, res) => {
    try {
        console.log(req.body);
        const patient = new Patient_1.default(req.body);
        await patient.save();
        res.status(201).json(patient);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create patient" });
    }
};
exports.createPatient = createPatient;
const getPatients = async (req, res) => {
    try {
        const patients = await Patient_1.default.find();
        // console.log("patients: " + patients);
        return res.status(200).json(patients);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch patients" });
    }
};
exports.getPatients = getPatients;
const getPatient = async (req, res) => {
    try {
        const patient = await Patient_1.default.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(patient);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch patient" });
    }
};
exports.getPatient = getPatient;
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update patient" });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient_1.default.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ message: "Patient deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete patient" });
    }
};
exports.deletePatient = deletePatient;
