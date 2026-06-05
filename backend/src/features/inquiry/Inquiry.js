import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
    },
    selectedPlan: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: ["unread", "read", "contacted"],
      default: "unread",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
