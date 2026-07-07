import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import net from "node:net";

import connectDB from "./config/db.js";
import { app, server } from "./config/socket.js";

import authRouter from "./features/auth/auth.route.js";
import messageRouter from "./features/messages/message.route.js";
import todoRouter from "./features/todo/todo.route.js";
import statRouter from "./features/stats/stat.route.js";
import projectRouter from "./features/projects/projectRoute.js";
import inquiryRouter from "./features/inquiry/inquiry.route.js";
import userRouter from "./features/user/user.route.js";
import quotationRouter from "./features/quotation/quotation.route.js";
import blogRouter from "./features/blog/blog.route.js";
import careerRouter from "./features/career/career.route.js";
import otpRouter from "./features/otp/otp.route.js";

// Load env variables first
dotenv.config();

// Force Node.js to prefer IPv4
dns.setDefaultResultOrder("ipv4first");

console.log("=================================");
console.log("Node Version:", process.version);
console.log("DNS Order:", dns.getDefaultResultOrder());
console.log("=================================");

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://vtrc-technologies.vercel.app",
      "https://vtrc-technologies-admin-tan.vercel.app",
      "https://vtrc-technologies-tau.vercel.app",
      "http://localhost",
    "capacitor://localhost",
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/todos", todoRouter);
app.use("/api/stats", statRouter);
app.use("/api/projects", projectRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/users", userRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/careers", careerRouter);
app.use("/api/otp", otpRouter);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running Successfully",
    nodeVersion: process.version,
    dnsOrder: dns.getDefaultResultOrder(),
  });
});

// Start Server
const PORT = process.env.PORT || 8000;

server.listen(PORT, async () => {
  try {
    await connectDB();

    console.log("=================================");
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log("=================================");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
});
