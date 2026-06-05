import Application from "./Application.js";
import cloudinary from "../../config/cloudinaryConfig.js";

// Helper to upload buffer to Cloudinary using stream
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "vtrc_applications", resource_type: "raw" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Submit a job application
// @route   POST /api/career/applications
// @access  Public
export const submitApplication = async (req, res) => {
  try {
    const { name, email, discipline, portfolio, pitch, jobId } = req.body;

    if (!name || !email || !discipline || !portfolio || !pitch) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume (PDF/DOCX)" });
    }

    console.log(`Starting Cloudinary upload for candidate: ${name}`);
    const result = await uploadToCloudinary(req.file.buffer);
    console.log(`Cloudinary upload successful: ${result.secure_url}`);

    const application = await Application.create({
      name,
      email,
      discipline,
      portfolio,
      pitch,
      resume: result.secure_url,
      jobId: (jobId && jobId !== "") ? jobId : null,
    });

    console.log(`Application created successfully in DB for: ${name}`);

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error("Submit Application Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// @desc    Get all job applications
// @route   GET /api/career/applications
// @access  Private/Admin
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "jobTitle department")
      .sort({ createdAt: -1 });
    console.log(`Backend: Found ${applications.length} applications in database.`);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Backend Get Applications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/career/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an application
// @route   DELETE /api/career/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
