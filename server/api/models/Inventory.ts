import mongoose, { Document, Schema } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  category: "ingredients" | "utensils" | "equipment";
  quantity: number;
  unit: string;
  minThreshold: number;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  supplier?: string;
  notes?: string;
}

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["ingredients", "utensils", "equipment"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    minThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    supplier: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create index for frequently queried fields
inventorySchema.index({ category: 1 });
inventorySchema.index({ quantity: 1 });

export default mongoose.model<IInventoryItem>("Inventory", inventorySchema);
