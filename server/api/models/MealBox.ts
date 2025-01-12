import mongoose, { Document, Schema } from "mongoose";

export interface IMealBox extends Document {
  taskId: Schema.Types.ObjectId;
  patientId: Schema.Types.ObjectId;
  dietChartId: Schema.Types.ObjectId;
  deliveryPersonnelId?: Schema.Types.ObjectId;
  mealType: "morning" | "afternoon" | "night";
  status: "preparing" | "ready" | "assigned" | "in-transit" | "delivered";
  preparationNotes?: string;
  deliveryNotes?: string;
  deliveryTime?: Date;
  specialInstructions?: string;
}

const mealBoxSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dietChartId: {
      type: Schema.Types.ObjectId,
      ref: "DietChart",
      required: true,
    },
    deliveryPersonnelId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Changed from DeliveryPersonnel to User
    },
    mealType: {
      type: String,
      enum: ["morning", "afternoon", "night"],
      required: true,
    },
    status: {
      type: String,
      enum: ["preparing", "ready", "assigned", "in-transit", "delivered"],
      default: "preparing",
    },
    preparationNotes: String,
    deliveryNotes: String,
    deliveryTime: Date,
    specialInstructions: String,
  },
  { timestamps: true }
);

export default mongoose.model<IMealBox>("MealBox", mealBoxSchema);
