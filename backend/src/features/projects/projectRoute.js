import express from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "./projectController.js";
import upload from "../../middlewares/uploadMiddleware.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", protectRoute, upload.single("image"), createProject);
router.put("/:id", protectRoute, upload.single("image"), updateProject);
router.delete("/:id", protectRoute, deleteProject);

export default router;
