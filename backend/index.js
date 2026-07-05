import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import cookieParser from "cookie-parser";
import lead from "./routes/lead.js";
import employee from "./routes/employee.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use("/api/lead", lead);
app.use("/api/employee", employee);

app.get("/", (req, res) => {
  res.send("Hello dev");
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
