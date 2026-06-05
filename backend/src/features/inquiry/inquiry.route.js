import express from "express";
import { 
    createInquiry, 
    getInquiries, 
    deleteInquiry,
    createProjectInquiry,
    getProjectInquiries,
    deleteProjectInquiry
} from "./inquiry.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// General inquiry routes
router.post("/", createInquiry);
router.get("/", protectRoute, getInquiries);
router.delete("/:id", protectRoute, deleteInquiry);

// Project inquiry routes
router.post("/project", createProjectInquiry);
router.get("/project", protectRoute, getProjectInquiries);
router.delete("/project/:id", protectRoute, deleteProjectInquiry);

export default router;
