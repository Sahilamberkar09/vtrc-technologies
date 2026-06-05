import express from "express";
import { sendEmailOtp, verifyEmailOtp } from "./otpController.js";

const router = express.Router();

// 1. Required routes for backend OTP verification
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);

// 2. Compatibility routes to prevent breaking the existing frontend
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;
