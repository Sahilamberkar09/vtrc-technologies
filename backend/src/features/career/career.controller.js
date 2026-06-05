import Career from "./Career.js";

export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      slug,
      department,
      location,
      jobType,
      description,
      requirements,
      benefits,
      salaryRange,
      isOpen,
    } = req.body;

    const newJob = new Career({
      jobTitle,
      slug,
      department,
      location,
      jobType,
      description,
      requirements,
      benefits,
      salaryRange,
      isOpen: isOpen === undefined ? true : (isOpen === "true" || isOpen === true),
    });

    await newJob.save();
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOpenJobs = async (req, res) => {
  try {
    const jobs = await Career.find({ isOpen: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobBySlug = async (req, res) => {
  try {
    const job = await Career.findOne({ slug: req.params.slug });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Career.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
