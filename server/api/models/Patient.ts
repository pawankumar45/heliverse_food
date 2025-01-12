import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
  contactInfo: {
    phone: string;
    emergencyContact: string;
  };
  roomDetails: {
    roomNumber: number;
    bedNumber: string;
    floorNumber: number;
  };
  medicalDetails: {
    diseases: string[];
    allergies: string[];
  };
  otherDetails: {
    admissionDate: Date;
    dietaryRestrictions: string[];
  };
}

const patientSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contactInfo: {
      phone: { type: String, required: true },
      emergencyContact: { type: String, required: true },
    },
    roomDetails: {
      roomNumber: { type: Number, required: true },
      bedNumber: { type: String, required: true },
      floorNumber: { type: Number, required: true },
    },
    medicalDetails: {
      diseases: [{ type: String }],
      allergies: [{ type: String }],
    },
    otherDetails: {
      admissionDate: { type: Date, default: Date.now },
      dietaryRestrictions: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPatient>("Patient", patientSchema);
