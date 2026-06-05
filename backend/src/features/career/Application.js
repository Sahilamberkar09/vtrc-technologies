import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    discipline: {
      type: String,
      required: true,
      enum: ["ENGINEERING", "DESIGN", "RESEARCH", "OPERATIONS"],
    },
    portfolio: {
      type: String,
      required: [true, "Please provide a portfolio URL"],
    },
    pitch: {
      type: String,
      required: [true, "Please provide a pitch"],
    },
    resume: {
      type: String,
      required: [true, "Please provide a resume file"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
