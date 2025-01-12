"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const dietChart_routes_1 = __importDefault(require("./routes/dietChart.routes"));
const pantry_routes_1 = __importDefault(require("./routes/pantry.routes"));
const delivery_routes_1 = __importDefault(require("./routes/delivery.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const innerPantry_routes_1 = __importDefault(require("./routes/innerPantry.routes"));
const summary_routes_1 = __importDefault(require("./routes/summary.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/patients", patient_routes_1.default);
app.use("/api/diet-charts", dietChart_routes_1.default);
app.use("/api/pantry", pantry_routes_1.default);
app.use("/api/delivery", delivery_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/inner-pantry", innerPantry_routes_1.default);
app.use("/api/summary", summary_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/", (req, res) => {
    return res.status(200).json({ message: "Hello World!" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
// MongoDB connection
mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hospital-food")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
