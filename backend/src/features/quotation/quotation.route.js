import express from "express";
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
} from "./quotation.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createQuotation);
router.get("/", protectRoute, getQuotations);
router.get("/:id", protectRoute, getQuotationById);
router.put("/:id", protectRoute, updateQuotation);
router.delete("/:id", protectRoute, deleteQuotation);

export default router;
