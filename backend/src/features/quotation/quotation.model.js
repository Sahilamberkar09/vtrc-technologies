import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
});

const roadmapSchema = new mongoose.Schema({
  step: { type: String, default: "" },
  label: { type: String, default: "" },
  duration: { type: String, default: "" },
});

const investmentSchema = new mongoose.Schema({
  item: { type: String, default: "" },
  price: { type: Number, default: 0 },
  type: { type: String, enum: ["fixed", "included"], default: "fixed" },
});

const supportPlanSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  subType: { type: String, default: "" },
  price: { type: Number, default: 0 },
  unit: { type: String, default: "" },
  description: { type: String, default: "" },
});

const quotationSchema = new mongoose.Schema(
  {
    quotationNo: { type: String, required: true, trim: true },
    date: { type: String, default: "" },
    clientName: { type: String, default: "" },
    clientAddress: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    projectType: { type: String, default: "" },
    executiveSummary: { type: String, default: "" },
    deliverables: { type: [deliverableSchema], default: [] },
    roadmap: { type: [roadmapSchema], default: [] },
    investment: { type: [investmentSchema], default: [] },
    totalValue: { type: Number, default: 0 },
    supportPlan: { type: supportPlanSchema, default: () => ({}) },
    milestones: { type: [String], default: [] },
    terms: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "sent"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Quotation = mongoose.model("Quotation", quotationSchema);
export default Quotation;
