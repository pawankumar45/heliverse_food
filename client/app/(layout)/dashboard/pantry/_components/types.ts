import { Schema } from "mongoose";

export interface MealTask {
  id: string;
  patientName: string;
  roomNumber: string;
  meal: string;
  status: "pending" | "preparing" | "ready";
}

export interface DeliveryPersonnel {
  _id: string;
  name: string;
  email: string;
  role: "delivery";
  currentAssignments: number;
  maxAssignments: number;
  deliveryStatus: "available" | "busy";
}

export interface MealDelivery {
  id: string;
  patientName: string;
  roomNumber: string;
  dietDetails: string;
  status: "pending" | "assigned" | "in-transit" | "delivered";
  assignedTo: string | null;
}

export interface PreparationTask {
  _id: string;
  patientId: {
    _id: string;
    name: string;
  };
  dietChartId: {
    _id: string;
    // Add any relevant diet chart fields
  };
  mealType: "morning" | "afternoon" | "night";
  status: "pending" | "in-progress" | "completed";
  notes?: string;
}

export interface MealBox {
  _id: string;
  taskId: Schema.Types.ObjectId;
  patientId: {
    _id: string;
    name: string;
    roomDetails: {
      roomNumber: string;
    };
  };
  dietChartId: Schema.Types.ObjectId;
  deliveryPersonnelId?: DeliveryPersonnel;
  mealType: "morning" | "afternoon" | "night";
  status: "preparing" | "ready" | "assigned" | "in-transit" | "delivered";
  preparationNotes?: string;
  deliveryNotes?: string;
  deliveryTime?: Date;
  specialInstructions?: string;
}

export interface NewMealBox {
  taskId: string;
  patientId: string;
  dietChartId: string;
  mealType: "morning" | "afternoon" | "night";
  specialInstructions?: string;
}
