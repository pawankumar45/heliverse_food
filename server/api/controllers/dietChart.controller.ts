import { Request, Response } from "express";
import DietChart from "../models/DietChart";

export const createDietChart = async (req: any, res: Response) => {
  try {
    console.log(req.body);
    const dietChart = new DietChart({
      ...req.body,
      createdBy: req.user.userId,
    });
    await dietChart.save();
    res.status(201).json(dietChart);
  } catch (error) {
    res.status(400).json({ message: "Failed to create diet chart" });
  }
};

export const getDietChartByPatientId = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.patientId;
    const dietChart = await DietChart.findOne({ patientId })
      .populate("createdBy", "name")
      .populate("patientId");

    // if (!dietChart) {
    //   return res
    //     .status(404)
    //     .json({ message: "Diet chart not found for this patient" });
    // }

    res.status(200).json(dietChart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch diet chart" });
  }
};
export const getDietCharts = async (req: Request, res: Response) => {
  try {
    const dietCharts = await DietChart.find()
      .populate("createdBy", "name")
      .populate("patientId")
      .sort({ createdAt: -1 });

    // console.log(dietCharts);

    res.status(200).json(dietCharts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch diet charts" });
  }
};

export const getDietChart = async (req: Request, res: Response) => {
  try {
    const dietChart = await DietChart.findById(req.params.id)
      .populate("patientId")
      .populate("createdBy", "name");
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found" });
    }
    res.json(dietChart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch diet chart" });
  }
};

export const updateDietChart = async (req: Request, res: Response) => {
  try {
    const dietChart = await DietChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found" });
    }
    res.json(dietChart);
  } catch (error) {
    res.status(400).json({ message: "Failed to update diet chart" });
  }
};

export const deleteDietChart = async (req: Request, res: Response) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found" });
    }
    res.json({ message: "Diet chart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete diet chart" });
  }
};
