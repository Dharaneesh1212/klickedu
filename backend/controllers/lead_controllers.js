import Lead from "../models/Lead.js";

const STAGE_SUB_STAGES = {
  New: ["Not Contacted", "Trying to Reach"],
  Contacted: ["Interested", "Needs Info", "Call Back Later"],
  Qualified: ["Counselling Done", "Documents Requested"],
  Application: ["Documents Pending", "Application Submitted", "Under Review"],
  Admission: ["Offer Letter Received", "Payment Pending", "Visa in Process"],
  Converted: ["Enrolled", "Travel Confirmed"],
  Lost: ["Not Interested", "Budget Issue", "Chose Competitor", "Unresponsive"]
};

const validateStageCombination = (stage, subStage) => {
  if (!stage || !subStage) return true; // allow empty subStage
  const validSubStages = STAGE_SUB_STAGES[stage];
  if (!validSubStages) return false;
  return validSubStages.includes(subStage);
};

// GET all leads with pagination, search, and filter
export const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      leadSource,
      priority,
      stage,
      subStage,
      country,
      courseInterested,
      assignedEmployee,
      startDate,
      endDate,
      followUpStartDate,
      followUpEndDate,
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { whatsapp: { $regex: search, $options: "i" } },
        { courseInterested: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (leadSource) query.leadSource = leadSource;
    if (priority) query.priority = priority;
    if (stage) query.stage = stage;
    if (subStage) query.subStage = subStage;
    if (country) query.country = country;
    if (courseInterested) query.courseInterested = courseInterested;
    if (assignedEmployee) query.assignedEmployee = assignedEmployee;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (followUpStartDate || followUpEndDate) {
      query.nextFollowUpDate = {};
      if (followUpStartDate) query.nextFollowUpDate.$gte = new Date(followUpStartDate);
      if (followUpEndDate) {
        const end = new Date(followUpEndDate);
        end.setHours(23, 59, 59, 999);
        query.nextFollowUpDate.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(query);
    
    const sortConfig = {};
    if (sortField) {
      sortConfig[sortField] = sortOrder === "asc" ? 1 : -1;
    }

    const leads = await Lead.find(query)
      .populate("assignedEmployee", "username email")
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      data: leads,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedEmployee", "username email")
      .populate("notes.createdBy", "username");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    if (req.body.stage && req.body.subStage) {
      if (!validateStageCombination(req.body.stage, req.body.subStage)) {
        return res.status(400).json({ message: "Invalid Sub Stage for selected Stage." });
      }
    }

    const newLead = new Lead(req.body);
    newLead.activities.push({
      action: "Lead Created",
      details: "Initial lead creation",
    });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    if (req.body.stage && req.body.subStage) {
      if (!validateStageCombination(req.body.stage, req.body.subStage)) {
        return res.status(400).json({ message: "Invalid Sub Stage for selected Stage." });
      }
    }

    const existingLead = await Lead.findById(req.params.id);
    if (!existingLead) return res.status(404).json({ message: "Lead not found" });

    const bodyToUpdate = { ...req.body };
    bodyToUpdate.$push = bodyToUpdate.$push || {};

    const newFollowUpDate = req.body.nextFollowUpDate ? new Date(req.body.nextFollowUpDate).getTime() : null;
    const oldFollowUpDate = existingLead.nextFollowUpDate ? new Date(existingLead.nextFollowUpDate).getTime() : null;
    if (
      (req.body.nextFollowUpDate !== undefined && newFollowUpDate !== oldFollowUpDate) ||
      ['Converted', 'Lost'].includes(req.body.stage) ||
      ['Converted', 'Lost'].includes(req.body.status)
    ) {
      bodyToUpdate.isOverdue = false;
    }

    if (req.body.status && req.body.status !== existingLead.status) {
       bodyToUpdate.$push.activities = { action: "Status Changed", details: `Status changed from ${existingLead.status || 'Unknown'} to ${req.body.status}` };
    } else if (req.body.stage && req.body.stage !== existingLead.stage) {
       bodyToUpdate.$push.activities = { action: "Stage Changed", details: `Stage changed from ${existingLead.stage || 'Unknown'} to ${req.body.stage}` };
    } else if (req.body.assignedEmployee && String(req.body.assignedEmployee) !== String(existingLead.assignedEmployee)) {
       bodyToUpdate.$push.activities = { action: "Assignment Changed", details: "Assigned employee was changed" };
    } else {
       bodyToUpdate.$push.activities = { action: "Lead Edited", details: "Lead details were updated" };
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, bodyToUpdate, {
      new: true,
      runValidators: true,
    }).populate("assignedEmployee", "username email");

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Notes
export const addNote = async (req, res) => {
  try {
    const { note, createdBy } = req.body;
    if (!note) return res.status(400).json({ message: "Note content is required" });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.notes.push({ note, createdBy });
    lead.activities.push({
      action: "Note Added",
      details: note,
    });
    await lead.save();

    const updatedLead = await Lead.findById(req.params.id).populate("notes.createdBy", "username");
    res.status(201).json(updatedLead.notes[updatedLead.notes.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { note } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, "notes._id": req.params.noteId },
      { $set: { "notes.$.note": note } },
      { new: true }
    ).populate("notes.createdBy", "username");
    if (!lead) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(lead.notes.id(req.params.noteId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newLeadsToday = await Lead.countDocuments({ createdAt: { $gte: startOfToday } });
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const newLeadsThisWeek = await Lead.countDocuments({ createdAt: { $gte: startOfWeek } });

    const convertedLeads = await Lead.countDocuments({ stage: "Converted" });
    const pendingFollowUps = await Lead.countDocuments({ 
      nextFollowUpDate: { $gte: startOfToday }, 
      stage: { $ne: "Converted" } 
    });
    
    const overdueFollowUps = await Lead.countDocuments({ isOverdue: true });
    
    const leadsByStage = await Lead.aggregate([
      { $group: { _id: { $ifNull: [{ $cond: [{ $eq: ["$stage", ""] }, "Unknown", "$stage"] }, "Unknown"] }, count: { $sum: 1 } } }
    ]);
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: { $ifNull: [{ $cond: [{ $eq: ["$leadSource", ""] }, "Unknown", "$leadSource"] }, "Unknown"] }, count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      cards: { totalLeads, newLeadsToday, newLeadsThisWeek, convertedLeads, pendingFollowUps, overdueFollowUps },
      charts: { leadsByStage, leadsBySource }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
