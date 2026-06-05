import Project from "./Project.js";
import cloudinary from "../../config/cloudinaryConfig.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
    try {
        const { featured } = req.query;
        let query = {};
        if (featured === "true") {
            query.isFeatured = true;
        }
        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper to upload buffer to Cloudinary using stream
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "vtrc_projects" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
    try {
        const { title, subtitle, description, link, category, year, client, tags, isFeatured } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const project = await Project.create({
            title,
            subtitle,
            description,
            image: result.secure_url,
            link,
            category,
            year,
            client,
            tags: tags ? JSON.parse(tags) : [],
            isFeatured: isFeatured === "true" || isFeatured === true,
        });

        return res.status(201).json({ success: true, data: project });

    } catch (error) {
        console.error("Create Project Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
    try {
        const { title, subtitle, description, link, category, year, client, tags, isFeatured } = req.body;
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const updateData = {
            title,
            subtitle,
            description,
            link,
            category,
            year,
            client,
            isFeatured: isFeatured === "true" || isFeatured === true,
        };

        if (tags) {
            updateData.tags = JSON.parse(tags);
        }

        if (req.file) {
            if (project.image) {
                const publicId = project.image.split('/').pop().split('.')[0];
                cloudinary.uploader.destroy(`vtrc_projects/${publicId}`).catch(err =>
                    console.warn("Background destroy failed:", err.message)
                );
            }
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.image = result.secure_url;
        }

        project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            returnDocument: 'after',
            runValidators: true,
        });

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Update Project Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Delete image from Cloudinary in background
        if (project.image) {
            const publicId = project.image.split('/').pop().split('.')[0];
            cloudinary.uploader.destroy(`pixelora_projects/${publicId}`).catch(err =>
                console.warn("Background destroy failed:", err.message)
            );
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
