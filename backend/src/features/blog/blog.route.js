import express from "express";
import { 
    createBlog, 
    getBlogs, 
    getPublishedBlogs, 
    getBlogBySlug, 
    updateBlog, 
    deleteBlog 
} from "./blog.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedBlogs);
router.get("/all", getBlogs); // This might need protection depending on use case, but keep public for now or protect if needed
router.get("/:slug", getBlogBySlug);

// Admin routes
router.post("/", protectRoute, upload.single("coverImage"), createBlog);
router.put("/:id", protectRoute, upload.single("coverImage"), updateBlog);
router.delete("/:id", protectRoute, deleteBlog);

export default router;
