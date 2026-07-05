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
      required: true,
    },
  },
  {
    timestamps: true,
  },
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
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  },
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
