import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    courseInterested: {
      type: String,
      trim: true,
    },
    lookingFor: {
      type: String,
      enum: ["India", "Abroad", ""],
      default: "",
    },
    preferredCountry: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    leadSource: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "Walk-in",
        "Social Media",
        "Advertisement",
        "Other",
      ],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Converted", "Lost"],
      default: "New",
    },
    stage: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Application", "Admission", "Converted", "Lost"],
      default: "New",
    },
    subStage: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Hot", "Warm", "Cold", ""],
      default: "",
    },
    nextFollowUpDate: { type: Date },
    lastContactedDate: { type: Date },
    isOverdue: { type: Boolean, default: false },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    notes: [noteSchema],
    activities: [activitySchema],
  },
  {
    timestamps: true,
  },
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
