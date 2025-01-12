import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "manager" | "pantry" | "delivery";
  phone: string;
  address: string;

  // Delivery specific fields
  deliveryStatus?: "available" | "busy" | "offline";
  currentAssignments?: number;
  maxAssignments?: number;
  rating?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["manager", "pantry", "delivery"],
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    // Delivery specific fields
    deliveryStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },
    currentAssignments: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAssignments: {
      type: Number,
      default: 5,
      min: 1,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
