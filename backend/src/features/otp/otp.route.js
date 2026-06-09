import express from "express";
import { sendOtp, verifyOtp } from "./otp.controller.js";

const otpRouter = express.Router();

otpRouter.post("/send", sendOtp);
otpRouter.post("/verify", verifyOtp);

export default otpRouter;
