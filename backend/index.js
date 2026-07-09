import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import cookieParser from "cookie-parser";
import lead from "./routes/lead.js";
import employee from "./routes/employee.js";
import { startCronJobs } from "./cron/automation.js";

dotenv.config();
connectDB();
startCronJobs();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",")
      : [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5000",
          "http://localhost:5001",
        ],
    credentials: true,
  }),
);

// Ensure DB is connected before handling any API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Database connection failed: ${error.message}` });
  }
});

app.use("/api/lead", lead);
app.use("/api/employee", employee);

app.get("/", (req, res) => {
  res.send("Hello dev");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
