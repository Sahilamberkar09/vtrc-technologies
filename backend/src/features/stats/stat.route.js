import express from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { getStats } from "./stat.controller.js";

const router = express.Router();

router.get("/", protectRoute, getStats);

export default router;
