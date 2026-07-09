import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  updateNote,
  deleteNote,
  getDashboardStats,
} from "../controllers/lead_controllers.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

router.post("/:id/notes", addNote);
router.put("/:id/notes/:noteId", updateNote);
router.delete("/:id/notes/:noteId", deleteNote);

export default router;
