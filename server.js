
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pushRoutes from "./routes/push.js"; // ES module import

dotenv.config();
// server.js


// Routes
import authRoutes from "./routes/auth.js";
import alertRoutes from "./routes/alerts.js";
import reportRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/settings.js";
import profileRoutes from "./routes/profile.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (req, res) => {
  res.send("LukOut Backend Running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/push", pushRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
