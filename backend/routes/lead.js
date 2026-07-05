import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/common_controllers.js";
import Lead from "../models/Lead.js";

const router = express.Router();

router.post("/", async (req, res) => {
  create(req, res, Lead);
});

router.put("/", async (req, res) => {
  update(req, res, Lead);
});

router.get("/", async (req, res) => {
  getAll(req, res, Lead);
});

router.get("/", async (req, res) => {
  getById(req, res, Lead);
});

router.delete("/", async (req, res) => {
  remove(req, res, Lead);
});

export default router;
