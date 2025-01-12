import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import dietChartRoutes from "./routes/dietChart.routes";
import pantryRoutes from "./routes/pantry.routes";
import deliveryRoutes from "./routes/delivery.routes";
import taskRoutes from "./routes/task.routes";
import innerPantryRoutes from "./routes/innerPantry.routes";
import summaryRoutes from "./routes/summary.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/diet-charts", dietChartRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/inner-pantry", innerPantryRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hospital-food")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
