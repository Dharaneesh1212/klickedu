import express from "express";
import { signup, signin } from "../controllers/auth_controller.js";
import Employee from "../models/Employee.js";
import { getAll } from "../controllers/common_controllers.js";

const router = express.Router();

router.post("/register", signup);

router.post("/login", signin);

router.get("/", async (req, res) => {
  getAll(req, res, Employee);
});

export default router;
