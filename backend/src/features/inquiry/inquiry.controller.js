import Inquiry from "./Inquiry.js";
import ProjectInquiry from "./ProjectInquiry.js";

// ── GENERAL INQUIRIES ──────────────────────────────────

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, selectedPlan } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      selectedPlan: selectedPlan || "General",
    });
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PROJECT INQUIRIES ──────────────────────────────────

export const createProjectInquiry = async (req, res) => {
  try {
    const { name, organization, email, scope, timeline, budget, brief } = req.body;
    if (!name || !organization || !email || !scope || !timeline || !budget || !brief) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    const inquiry = await ProjectInquiry.create({
      name,
      organization,
      email,
      scope,
      timeline,
      budget,
      brief,
    });
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectInquiries = async (req, res) => {
  try {
    const inquiries = await ProjectInquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProjectInquiry = async (req, res) => {
  try {
    const inquiry = await ProjectInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
