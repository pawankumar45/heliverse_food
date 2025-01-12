import { Request, Response } from "express";
import Patient from "../models/Patient";

export const createPatient = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Failed to create patient" });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    // console.log("patients: " + patients);

    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch patients" });
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Failed to update patient" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete patient" });
  }
};
