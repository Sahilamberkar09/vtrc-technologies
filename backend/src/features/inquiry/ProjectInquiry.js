import mongoose from "mongoose";

const projectInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, "Please provide your organization"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    scope: [
      {
        type: String,
        required: true,
      },
    ],
    timeline: {
      type: String,
      required: true,
      enum: ["Q1", "Q2", "Q3", "Q4"],
    },
    budget: {
      type: String,
      required: true,
    },
    brief: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "contacted", "archived"],
      default: "unread",
    },
  },
  { timestamps: true }
);

const ProjectInquiry = mongoose.model("ProjectInquiry", projectInquirySchema);

export default ProjectInquiry;
