// Import necessary modules
import mongoose, { Document, Schema } from "mongoose";

// Interface for the DietChart Document
export interface IDietChart extends Document {
  patientId: Schema.Types.ObjectId;
  meals: {
    morning: {
      menu: string[];
      ingredients: string[];
      instructions: string;
    };
    afternoon: {
      menu: string[];
      ingredients: string[];
      instructions: string;
    };
    night: {
      menu: string[];
      ingredients: string[];
      instructions: string;
    };
  };
  createdBy: Schema.Types.ObjectId;
}

// DietChart Schema
const dietChartSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    meals: {
      morning: {
        menu: [{ type: String }],
        ingredients: [{ type: String }],
        instructions: String,
      },
      afternoon: {
        menu: [{ type: String }],
        ingredients: [{ type: String }],
        instructions: String,
      },
      night: {
        menu: [{ type: String }],
        ingredients: [{ type: String }],
        instructions: String,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Model export
export default mongoose.model<IDietChart>("DietChart", dietChartSchema);
