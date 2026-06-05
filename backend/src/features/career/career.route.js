import express from "express";
import { 
    createJob, 
    getJobs, 
    getOpenJobs, 
    getJobBySlug, 
    updateJob, 
    deleteJob 
} from "./career.controller.js";
import {
    submitApplication,
    getApplications,
    updateApplicationStatus,
    deleteApplication
} from "./application.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Application routes
router.post("/applications", upload.single("resume"), submitApplication);
router.get("/applications", protectRoute, getApplications);
router.patch("/applications/:id", protectRoute, updateApplicationStatus);
router.delete("/applications/:id", protectRoute, deleteApplication);

// Job routes
router.get("/", getOpenJobs);
router.get("/all", getJobs);
router.get("/:slug", getJobBySlug);

// Admin job management routes
router.post("/", protectRoute, createJob);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);

export default router;
