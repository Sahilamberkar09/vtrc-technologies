import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      default: "Engineering",
    },
    location: {
      type: String,
      required: true,
      default: "Remote",
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    salaryRange: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Career = mongoose.model("Career", careerSchema);

export default Career;
